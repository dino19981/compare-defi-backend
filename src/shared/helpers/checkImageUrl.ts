/**
 * Проверяет доступность URL изображения
 * @param url - URL для проверки
 * @returns Promise с результатом проверки
 */
export interface ImageUrlCheckResult {
  url: string;
  isAvailable: boolean;
  statusCode?: number;
  error?: string;
}

export const checkImageUrl = async (
  url: string,
): Promise<ImageUrlCheckResult> => {
  try {
    const response = await fetch(url, {
      method: 'HEAD', // Используем HEAD для экономии трафика
      headers: {
        'User-Agent': 'Mozilla/5.0 (compatible; ImageChecker/1.0)',
      },
    });

    return {
      url,
      isAvailable: response.ok,
      statusCode: response.status,
    };
  } catch (error) {
    return {
      url,
      isAvailable: false,
      error: error instanceof Error ? error.message : 'Unknown error',
    };
  }
};

/**
 * Проверяет несколько URL-ов параллельно
 * @param urls - массив URL-ов для проверки
 * @returns Promise с результатами проверки всех URL-ов
 */
export const checkMultipleImageUrls = async (
  urls: string[],
): Promise<ImageUrlCheckResult[]> => {
  const promises = urls.map((url) => checkImageUrl(url));
  return Promise.all(promises);
};

/**
 * Находит первый доступный URL из списка
 * @param urls - массив URL-ов для проверки
 * @returns Promise с первым доступным URL или null
 */
export const findFirstAvailableImageUrl = async (
  urls: string[],
): Promise<string | null> => {
  const results = await checkMultipleImageUrls(urls);
  const availableResult = results.find((result) => result.isAvailable);
  return availableResult ? availableResult.url : null;
};
