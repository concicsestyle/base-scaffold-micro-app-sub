/**
 * 脱敏处理工具函数
 * @param value 需要脱敏的值
 * @param options 脱敏配置
 */
export function desensitize(value: string | number | undefined | null, options: DesensitizeOptions = {}): string {
  if (value === undefined || value === null || value === '') return '';

  const strValue = String(value);

  // 根据类型进行特定处理
  if (options.type) {
    switch (options.type) {
      case 'phone':
        return desensitizePhone(strValue);
      case 'idCard':
        return desensitizeIdCard(strValue);
      case 'email':
        return desensitizeEmail(strValue);
      case 'name':
        return desensitizeName(strValue);
      case 'bankCard':
        return desensitizeBankCard(strValue);
      case 'custom':
        return desensitizeCustom(strValue, options);
      default:
        return strValue;
    }
  }

  // 自定义脱敏
  return desensitizeCustom(strValue, options);
}

/**
 * 手机号脱敏（默认保留前3后4）
 */
function desensitizePhone(value: string): string {
  if (value.length < 7) return value;
  return value.replace(/(\d{3})\d{4}(\d{4})/, '$1****$2');
}

/**
 * 身份证脱敏（默认保留前6后4）
 */
function desensitizeIdCard(value: string): string {
  if (value.length < 10) return value;
  return value.replace(/(\d{6})\d{8}(\d{4})/, '$1********$2');
}

/**
 * 邮箱脱敏（保留首字母和域名）
 */
function desensitizeEmail(value: string): string {
  const [name, domain] = value.split('@');
  if (!domain) return value;
  if (name.length <= 1) return `*@${domain}`;
  return `${name[0]}****@${domain}`;
}

/**
 * 姓名脱敏（保留首字符）
 */
function desensitizeName(value: string): string {
  if (value.length <= 1) return value;
  return value[0] + '*'.repeat(value.length - 1);
}

/**
 * 银行卡号脱敏（保留前4后4）
 */
function desensitizeBankCard(value: string): string {
  if (value.length < 9) return value;
  return value.replace(/(\d{4})\d+(\d{4})/, '$1 **** **** $2');
}

/**
 * 自定义脱敏
 */
function desensitizeCustom(value: string, { start = 0, end = 0, replaceChar = '*', showLength = 0 }: DesensitizeOptions): string {
  const len = value.length;

  // 如果指定了显示长度，则计算需要脱敏的部分
  if (showLength > 0 && showLength < len) {
    const hideLength = len - showLength;
    const leftLength = Math.floor(showLength / 2);
    const rightLength = showLength - leftLength;

    return value.substring(0, leftLength) + replaceChar.repeat(hideLength) + value.substring(len - rightLength);
  }

  // 否则使用开始和结束位置进行脱敏
  const visibleStart = Math.min(Math.max(0, start), len);
  const visibleEnd = Math.max(Math.min(end, len), 0);

  if (visibleStart >= visibleEnd) return replaceChar.repeat(len);

  return value.substring(0, visibleStart) + replaceChar.repeat(visibleEnd - visibleStart) + value.substring(visibleEnd);
}

/**
 * 脱敏配置选项
 */
export interface DesensitizeOptions {
  /**
   * 预定义的脱敏类型
   */
  type?: 'phone' | 'idCard' | 'email' | 'name' | 'bankCard' | 'custom';

  /**
   * 脱敏起始位置（包含），从0开始计数
   */
  start?: number;

  /**
   * 脱敏结束位置（不包含）
   */
  end?: number;

  /**
   * 替换字符，默认为 *
   */
  replaceChar?: string;

  /**
   * 保留显示的长度，与 start/end 互斥
   */
  showLength?: number;
}
