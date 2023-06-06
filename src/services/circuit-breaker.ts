import { AxiosError, AxiosRequestConfig } from 'axios'

const CircuitBreakerStates = {
  OPENED: 'OPENED',
  CLOSED: 'CLOSED',
  HALF: 'HALF',
}

type OptionsProps = {
  failureThreshold: 5
  timeout: 5000
}

export default function CircuitBreaker(options?: OptionsProps) {
  let state = CircuitBreakerStates.CLOSED
  let resetAfter = Date.now()
  let failureCount = 0

  const failureThreshold = options?.failureThreshold
    ? options.failureThreshold
    : 5

  const timeout = options?.timeout ? options.timeout : 5000
  // const error = {
  //   error: 'circuit is in open state right now.Please try again later',
  // }

  const fire = (axiosConfig: AxiosRequestConfig<any>) => {
    switch (state) {
      case CircuitBreakerStates.CLOSED:
        break
      case CircuitBreakerStates.OPENED:
        if (resetAfter <= Date.now()) {
          state = CircuitBreakerStates.HALF
          break
        } else {
          throw new AxiosError(
            'service is down, please try again later',
            '425',
            axiosConfig as any
          )
        }
      case CircuitBreakerStates.HALF:
        break
    }
  }

  const success = () => {
    failureCount = 0
    if (state === CircuitBreakerStates.HALF) {
      state = CircuitBreakerStates.CLOSED
    }
  }

  const failure = () => {
    failureCount++
    if (
      state === CircuitBreakerStates.HALF ||
      failureCount >= failureThreshold
    ) {
      state = CircuitBreakerStates.OPENED
      resetAfter = Date.now() + timeout
    }
  }

  return { fire, success, failure }
}
