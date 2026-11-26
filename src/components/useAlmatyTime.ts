'use client'

import { useEffect, useState } from 'react'

const fmt = new Intl.DateTimeFormat('en-GB', { timeZone: 'Asia/Almaty', hour: '2-digit', minute: '2-digit' })

export function useAlmatyTime() {
  const [time, setTime] = useState('--:--')
  useEffect(() => {
    const update = () => setTime(fmt.format(new Date()))
    update()
    const id = setInterval(update, 15_000)
    return () => clearInterval(id)
  }, [])
  return time
}
