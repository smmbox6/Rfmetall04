// Конфигурация Bitrix24
const BITRIX_CONFIG = {
  // Эти данные должны быть в переменных окружения в продакшене
  PORTAL_URL: 'https://metal.bitrix24.kz',
  USER_ID: '1',
  WEBHOOK_KEY: 'wrq55a2ynzo4dzlx'
};

// Получаем базовый URL для API
const getApiUrl = () => {
  return `${BITRIX_CONFIG.PORTAL_URL}/rest/${BITRIX_CONFIG.USER_ID}/${BITRIX_CONFIG.WEBHOOK_KEY}`;
};

// Интерфейс для данных лида
interface LeadData {
  name: string;
  phone: string;
  formType: string;
  comment?: string;
  productData?: any;
  source?: string;
  url?: string;
  userAgent?: string;
  timestamp?: string;
}

// Функция для получения IP адреса клиента
const getClientIP = async (): Promise<string> => {
  try {
    const response = await fetch('https://api.ipify.org?format=json');
    const data = await response.json();
    return data.ip;
  } catch (error) {
    console.error('Ошибка получения IP:', error);
    return 'Не определен';
  }
};

// Функция для получения UTM меток из URL
const getUtmParams = (): Record<string, string> => {
  const urlParams = new URLSearchParams(window.location.search);
  return {
    utm_source: urlParams.get('utm_source') || '',
    utm_medium: urlParams.get('utm_medium') || '',
    utm_campaign: urlParams.get('utm_campaign') || '',
    utm_content: urlParams.get('utm_content') || '',
    utm_term: urlParams.get('utm_term') || ''
  };
};

// Функция для генерации уникального ID клиента
const getClientId = (): string => {
  let clientId = localStorage.getItem('client_id');
  if (!clientId) {
    clientId = 'client_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
    localStorage.setItem('client_id', clientId);
  }
  return clientId;
};

// Функция для форматирования номера телефона
const formatPhone = (phone: string): string => {
  const cleaned = phone.replace(/\D/g, '');
  
  if (cleaned.length === 11 && cleaned.startsWith('8')) {
    return '+7' + cleaned.slice(1);
  } else if (cleaned.length === 10) {
    return '+7' + cleaned;
  } else if (cleaned.length === 11 && cleaned.startsWith('7')) {
    return '+' + cleaned;
  }
  
  return phone;
};

// Функция для поиска существующего лида по номеру телефона
const findExistingLead = async (phone: string): Promise<any> => {
  try {
    const formattedPhone = formatPhone(phone);
    const apiUrl = `${getApiUrl()}/crm.lead.list`;
    
    const response = await fetch(apiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: `filter[PHONE]=${encodeURIComponent(formattedPhone)}&filter[>DATE_CREATE]=${encodeURIComponent(new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString())}&select[]=ID&select[]=TITLE&select[]=NAME&select[]=COMMENTS`
    });

    const result = await response.json();
    
    if (result.result && result.result.length > 0) {
      return result.result[0];
    }
    
    return null;
  } catch (error) {
    console.error('Ошибка поиска лида:', error);
    return null;
  }
};

// Функция для создания нового лида
const createLead = async (leadData: LeadData): Promise<any> => {
  try {
    const clientIP = await getClientIP();
    const utmParams = getUtmParams();
    const clientId = getClientId();
    const formattedPhone = formatPhone(leadData.phone);
    
    // Определяем источник по домену
    const domain = window.location.hostname;
    let sourceId = 'WEB';
    
    switch (domain) {
      case 'atlantsnabcity.kz':
        sourceId = 'WEB';
        break;
      case 'atlantsnab.kz':
        sourceId = 'WEB';
        break;
      default:
        sourceId = 'WEB';
    }

    // Формируем комментарий с подробной информацией
    let comments = `Заявка с сайта: ${leadData.source || 'АТЛАНТ Снаб Сити'}
Форма: ${leadData.formType}
IP адрес: ${clientIP}
Client ID: ${clientId}
URL: ${leadData.url || window.location.href}
User Agent: ${leadData.userAgent || navigator.userAgent}
Время: ${leadData.timestamp || new Date().toISOString()}`;

    if (leadData.comment) {
      comments += `\nКомментарий клиента: ${leadData.comment}`;
    }

    if (leadData.productData) {
      comments += `\n\nВыбранный товар:`;
      if (leadData.productData.item) {
        comments += `\nТовар: ${leadData.productData.item.name} ${leadData.productData.item.size}`;
        comments += `\nКоличество: ${leadData.productData.quantity} шт.`;
        comments += `\nОбщий вес: ${leadData.productData.totalWeight?.toFixed(2)} т`;
        comments += `\nСтоимость: ${Math.round(leadData.productData.totalPrice || 0).toLocaleString()} ₸`;
        comments += `\nФилиал: ${leadData.productData.item.branch}`;
        comments += `\nГОСТ: ${leadData.productData.item.gost}`;
      }
    }

    // UTM метки
    if (Object.values(utmParams).some(value => value)) {
      comments += `\n\nUTM метки:`;
      Object.entries(utmParams).forEach(([key, value]) => {
        if (value) comments += `\n${key}: ${value}`;
      });
    }

    const apiUrl = `${getApiUrl()}/crm.lead.add`;
    
    const formData = new URLSearchParams({
      'fields[TITLE]': `Заявка с сайта: ${domain}`,
      'fields[NAME]': leadData.name,
      'fields[SOURCE_ID]': sourceId,
      'fields[STATUS_DESCRIPTION]': leadData.url || window.location.href,
      'fields[ASSIGNED_BY_ID]': '1', // ID ответственного
      'fields[COMMENTS]': comments,
      'fields[OPENED]': 'Y',
      'fields[PHONE][0][VALUE]': formattedPhone,
      'fields[PHONE][0][VALUE_TYPE]': 'WORK',
      'fields[UTM_SOURCE]': utmParams.utm_source,
      'fields[UTM_MEDIUM]': utmParams.utm_medium,
      'fields[UTM_CAMPAIGN]': utmParams.utm_campaign,
      'fields[UTM_CONTENT]': utmParams.utm_content,
      'fields[UTM_TERM]': utmParams.utm_term,
      'params[REGISTER_SONET_EVENT]': 'Y'
    });

    const response = await fetch(apiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: formData
    });

    const result = await response.json();
    
    if (result.result) {
      // Добавляем комментарий в таймлайн
      await addTimelineComment(result.result, comments);
      return { success: true, leadId: result.result };
    } else {
      console.error('Ошибка создания лида:', result);
      return { success: false, error: result.error_description || 'Неизвестная ошибка' };
    }
  } catch (error) {
    console.error('Ошибка создания лида:', error);
    return { success: false, error: 'Ошибка сети' };
  }
};

// Функция для обновления существующего лида
const updateLead = async (leadId: string, leadData: LeadData): Promise<any> => {
  try {
    const clientIP = await getClientIP();
    const clientId = getClientId();
    
    let comments = `ПОВТОРНАЯ ЗАЯВКА
Форма: ${leadData.formType}
IP адрес: ${clientIP}
Client ID: ${clientId}
URL: ${leadData.url || window.location.href}
Время: ${leadData.timestamp || new Date().toISOString()}`;

    if (leadData.comment) {
      comments += `\nКомментарий клиента: ${leadData.comment}`;
    }

    if (leadData.productData) {
      comments += `\n\nВыбранный товар:`;
      if (leadData.productData.item) {
        comments += `\nТовар: ${leadData.productData.item.name} ${leadData.productData.item.size}`;
        comments += `\nКоличество: ${leadData.productData.quantity} шт.`;
        comments += `\nОбщий вес: ${leadData.productData.totalWeight?.toFixed(2)} т`;
        comments += `\nСтоимость: ${Math.round(leadData.productData.totalPrice || 0).toLocaleString()} ₸`;
      }
    }

    const apiUrl = `${getApiUrl()}/crm.lead.update`;
    
    const formData = new URLSearchParams({
      'id': leadId,
      'fields[TITLE]': `ПОВТОР: Заявка с сайта: ${window.location.hostname}`,
      'fields[COMMENTS]': comments,
      'params[REGISTER_SONET_EVENT]': 'Y'
    });

    const response = await fetch(apiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: formData
    });

    const result = await response.json();
    
    if (result.result) {
      // Добавляем комментарий в таймлайн
      await addTimelineComment(leadId, comments);
      return { success: true, leadId: leadId };
    } else {
      console.error('Ошибка обновления лида:', result);
      return { success: false, error: result.error_description || 'Неизвестная ошибка' };
    }
  } catch (error) {
    console.error('Ошибка обновления лида:', error);
    return { success: false, error: 'Ошибка сети' };
  }
};

// Функция для добавления комментария в таймлайн
const addTimelineComment = async (leadId: string, comment: string): Promise<void> => {
  try {
    const apiUrl = `${getApiUrl()}/crm.timeline.comment.add`;
    
    const formData = new URLSearchParams({
      'fields[ENTITY_ID]': leadId,
      'fields[AUTHOR_ID]': '1',
      'fields[ENTITY_TYPE]': 'lead',
      'fields[COMMENT]': comment
    });

    await fetch(apiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: formData
    });
  } catch (error) {
    console.error('Ошибка добавления комментария:', error);
  }
};

// Основная функция для отправки лида
export const submitLead = async (leadData: LeadData): Promise<{ success: boolean; error?: string }> => {
  try {
    // Проверяем, есть ли уже лид с таким номером телефона
    const existingLead = await findExistingLead(leadData.phone);
    
    if (existingLead) {
      // Обновляем существующий лид
      const result = await updateLead(existingLead.ID, leadData);
      return result;
    } else {
      // Создаем новый лид
      const result = await createLead(leadData);
      return result;
    }
  } catch (error) {
    console.error('Ошибка отправки лида:', error);
    return { success: false, error: 'Произошла ошибка при отправке заявки' };
  }
};