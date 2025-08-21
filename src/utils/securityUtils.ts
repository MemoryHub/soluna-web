/**
 * 安全工具类，提供加密和解密功能
 * 与后端SecurityUtils类保持兼容
 */
export class SecurityUtils {
  private key: CryptoKey | null;
  private readonly encryptionKeyStr: string = 'soluna_encryption_key_32bytes!'; // 与后端保持一致

  constructor() {
    this.key = null;
    this.initializeKey();
  }

  /**
   * 初始化加密密钥
   */
  private async initializeKey(): Promise<void> {
    try {
      // 将字符串密钥转换为符合AES要求的CryptoKey
      const encoder = new TextEncoder();
      // 确保密钥长度为32字节（256位）
      const keyData = encoder.encode(this.encryptionKeyStr.padEnd(32).substring(0, 32));
      
      this.key = await crypto.subtle.importKey(
        'raw',
        keyData,
        { name: 'AES-CBC' },
        false,
        ['encrypt', 'decrypt']
      );
    } catch (error) {
      console.error('Failed to initialize encryption key:', error);
    }
  }

  /**
   * 加密数据
   * @param data 要加密的数据对象
   * @returns 加密后的base64字符串
   */
  async encrypt(data: any): Promise<string> {
    if (!this.key) {
      await this.initializeKey();
      // 再次检查key是否初始化成功
      if (!this.key) {
        throw new Error('Failed to initialize encryption key');
      }
    }

    try {
      // 生成随机IV
      const iv = crypto.getRandomValues(new Uint8Array(16));
      
      // 将数据对象转换为JSON字符串
      const dataStr = JSON.stringify(data);
      const encoder = new TextEncoder();
      const dataBuffer = encoder.encode(dataStr);
      
      // 对数据进行PKCS#7填充
      const paddedData = this.padData(dataBuffer);
      
      // 加密数据
      const encryptedData = await crypto.subtle.encrypt(
        {
          name: 'AES-CBC',
          iv: iv
        },
        this.key,
        paddedData
      );
      
      // 组合IV和加密数据
      const combinedBuffer = new Uint8Array(iv.length + encryptedData.byteLength);
      combinedBuffer.set(iv);
      combinedBuffer.set(new Uint8Array(encryptedData), iv.length);
      
      // 转换为Base64字符串
      return btoa(String.fromCharCode(...combinedBuffer));
    } catch (error) {
      console.error('Encryption failed:', error);
      throw new Error('Failed to encrypt data');
    }
  }

  /**
   * 加密角色数据 - 与Postman实现完全一致的加密方法
   * @param characterData 角色数据对象
   * @returns 加密后的base64字符串
   */
  async encryptCharacterData(characterData: any): Promise<string> {
    try {
      // 确保key是32字节
      const paddedKeyStr = this.encryptionKeyStr.padEnd(32).substring(0, 32);
      const encoder = new TextEncoder();
      const keyData = encoder.encode(paddedKeyStr);
      
      // 生成随机IV
      const iv = crypto.getRandomValues(new Uint8Array(16));
      
      // 将数据对象转换为JSON字符串
      const dataStr = JSON.stringify(characterData);
      const dataBuffer = encoder.encode(dataStr);
      
      // 对数据进行PKCS#7填充
      const paddedData = this.padData(dataBuffer);
      
      // 使用Web Crypto API进行加密
      const key = await crypto.subtle.importKey(
        'raw',
        keyData,
        { name: 'AES-CBC' },
        false,
        ['encrypt']
      );
      
      const encryptedData = await crypto.subtle.encrypt(
        {
          name: 'AES-CBC',
          iv: iv
        },
        key,
        paddedData
      );
      
      // 组合IV和加密数据
      const combinedBuffer = new Uint8Array(iv.length + encryptedData.byteLength);
      combinedBuffer.set(iv);
      combinedBuffer.set(new Uint8Array(encryptedData), iv.length);
      
      // 转换为Base64字符串
      return btoa(String.fromCharCode(...combinedBuffer));
    } catch (error) {
      console.error('Character data encryption failed:', error);
      throw new Error('Failed to encrypt character data');
    }
  }

  /**
   * 解密数据
   * @param encryptedData 加密后的base64字符串
   * @returns 解密后的原始数据
   */
  async decrypt(encryptedData: string): Promise<string> {
    if (!this.key) {
      await this.initializeKey();
      // 再次检查key是否初始化成功
      if (!this.key) {
        throw new Error('Failed to initialize encryption key');
      }
    }

    try {
      // 将base64字符串转换为二进制数据
      const binaryData = Uint8Array.from(atob(encryptedData), c => c.charCodeAt(0));
      
      // 提取IV（前16字节）
      const iv = binaryData.slice(0, 16);
      // 提取加密数据（IV之后的部分）
      const encryptedContent = binaryData.slice(16);
      
      // 解密数据
      const decryptedData = await crypto.subtle.decrypt(
        {
          name: 'AES-CBC',
          iv: iv
        },
        this.key,
        encryptedContent
      );
      
      // 去除PKCS#7填充
      const unpaddedData = this.unpadData(new Uint8Array(decryptedData));
      
      // 将解密后的二进制数据转换为字符串
      const decoder = new TextDecoder();
      return decoder.decode(unpaddedData);
    } catch (error) {
      console.error('Decryption failed:', error);
      throw new Error('Failed to decrypt data');
    }
  }

  /**
   * 对数据进行PKCS#7填充
   */
  private padData(data: Uint8Array): Uint8Array {
    const blockSize = 16; // AES-CBC块大小为16字节
    const paddingSize = blockSize - (data.length % blockSize);
    const paddedData = new Uint8Array(data.length + paddingSize);
    paddedData.set(data);
    
    // 添加PKCS#7填充
    for (let i = 0; i < paddingSize; i++) {
      paddedData[data.length + i] = paddingSize;
    }
    
    return paddedData;
  }

  /**
   * 去除PKCS#7填充
   */
  private unpadData(data: Uint8Array): Uint8Array {
    const padLength = data[data.length - 1];
    return data.slice(0, data.length - padLength);
  }
}

// 创建单例实例
export const securityUtils = new SecurityUtils();