// credits: https://gist.github.com/ca0v/73a31f57b397606c9813472f7493a940?permalink_comment_id=4307328#gistcomment-4307328

export default function debounce<
  F extends (...args: Parameters<F>) => ReturnType<F>
>(func: F, delay: number): (...args: Parameters<F>) => void {
  let timeout: NodeJS.Timeout
  return (...args: Parameters<F>): void => {
    clearTimeout(timeout)
    timeout = setTimeout(() => func(...args), delay)
  }
}
