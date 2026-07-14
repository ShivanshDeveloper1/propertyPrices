"use client"
import React, { useState } from 'react'
// import { questions } from '@/data/Accordian'
import { Plus } from 'lucide-react'
import { useScroll } from 'framer-motion'
import { motion, AnimatePresence } from 'framer-motion'

const Accordian = ({questions}) => {
  const [open, setOpen] = useState([])

  const handleClick = (i) => {
    if (open.includes(i)) {
      setOpen((prev) => prev.filter((item) => item != i))
    } else {
      setOpen([...open, i])
    }
  }

  return (
    // 1. Added items-start to prevent the left sidebar from stretching vertically when panels expand
    <main className='flex flex-col md:flex-row gap-8 md:gap-4 py-8 items-start w-full max-w-6xl mx-auto px-4'>
        
        {/* Left Sidebar Layout */}
        <div className='w-full md:w-1/3 md:sticky md:top-8'>
            <p className='px-4 py-2 rounded-2xl bg-gray-100 border border-gray-300 w-fit text-sm font-medium text-gray-600'>Trending</p>
            <p className='text-3xl md:text-4xl mt-4 text-gray-800 font-bold tracking-tight leading-tight'>Frequently asked questions</p>
        </div>

        {/* Right Questions Layout */}
        {/* 2. Added flex-1 and w-full so this container commands the remaining horizontal space without shrinking */}
        <div className='flex-1 w-full flex flex-col'>
          {
            questions.map((quest, i) => {
              const isOpen = open.includes(i);
              return (
                <div 
                  className='border-b border-gray-200 py-6 cursor-pointer group' 
                  key={i} 
                  onClick={() => handleClick(i)}
                >
                  {/* 3. Added items-center to make sure the question text and icon stay perfectly aligned */}
                  <div className='flex justify-between items-center gap-4'>
                     <p className='text-gray-800 font-bold text-lg md:text-2xl group-hover:text-black transition-colors duration-200'>{quest.question}</p>
                     
                     {/* 4. Added a transition to spin the Plus icon when open, giving it a premium feel */}
                     <span className={`w-10 h-10 shrink-0 flex items-center justify-center border border-gray-300 rounded-full transition-transform duration-300 ${isOpen ? 'rotate-45 bg-gray-50' : ''}`}>
                        <Plus size={18} className="text-gray-600" />
                     </span>
                  </div>

                  <AnimatePresence initial={false}>
                    {
                      isOpen && (
                        <motion.div 
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: "auto", opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.25, ease: "easeInOut" }}
                          className="overflow-hidden"
                        >
                          {/* 5. Cleaned up text colors and spacing to ensure readability */}
                          <p className='mt-3 text-gray-600 text-base leading-relaxed max-w-2xl'>{quest.answer}</p>
                        </motion.div>
                      )
                    }
                  </AnimatePresence>
                </div>
              )
            })
          }
        </div>

    </main> 
  )
}

export default Accordian