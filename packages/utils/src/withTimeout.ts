/**
 * https://qiita.com/Yarnaguchi/items/515af4c4b068c4d1f25e
 * await にタイムアウトを設定する
 * timeoutを超えて await で待機すると UnhandledPromiseRejection 例外が throw されます。
 * @param {Promise} promise - 実行したい promise 関数
 * @param {number} timeout - タイムアウト(ms)
 * @returns Promise<T>
 */
export function withTimeout<T>(promise: Promise<T>, timeout: number) {
  const timeoutPromise: Promise<T> = new Promise((_, reject) =>
    setTimeout(() => reject(), timeout),
  );
  return Promise.race([promise, timeoutPromise]);
}
