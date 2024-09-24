import React, { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

interface AlertModalProps {
  message: string | null
  duration?: number
}

export const AlertModal: React.FC<AlertModalProps> = ({ message, duration = 3000 }) => {
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    if (message) {
      setIsVisible(true)
      const timer = setTimeout(() => {
        setIsVisible(false)
      }, duration)
      return () => clearTimeout(timer)
    }
  }, [message, duration])

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -50 }}
          transition={{ duration: 0.3 }}
          className="fixed top-4 left-1/2 transform -translate-x-1/2 z-50"
        >
          <div className="bg-yellow-100 border-l-4 border-yellow-500 text-yellow-700 p-4 rounded shadow-lg">
            <p>{message}</p>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}