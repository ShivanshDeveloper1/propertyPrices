// "use client"
// import React, { useEffect, useState } from 'react'

// const page = () => {
//     const [cards , setCards] = useState([])
    


//     useEffect(()=> {

//             const getAllData = async() => {
//         const repsonse = await fetch('/api/blogs')
//         const data = await repsonse.json()
//         console.log(data)
//         setCards(data)

//     }

//     getAllData()


//     },[])

//     const handleDeleted = async(slug)=> {

//         const response = await fetch('/api/blogs', {
//             method:'DELETE',
//           headers:{'Content-Type':'application/json'},
//             body:JSON.stringify({slug})
//         })

//         if(response.ok){
//               setCards(prev => 
//       prev.filter(card => card.post.metadata.slug !== slug)
//     )

//      alert("Deleted Successfully")
//         }


//     }




//   return (
//     <main className='min-h-screen  mt-6  '>
//         <h1 className='text-3xl font-extrabold text-center '>All Bogs</h1>

//         <section className='mt-6 max-w-5xl mx-auto px-4 grid grid-cols-3 gap-4'>
//             {
//                 cards.map((card , index)=> (
//                     <div className='bg-gray-300 white flex justify-center items-center py-4 flex-col gap-4'  key={index}>
//                         <div className='m-4'>
//                         <p className='text-xl font-bold'>{card.post.metadata.title}</p>
//                         <p className='text-gray-600'>{card.post.metadata.summary}</p>
//                         </div>

// <div className='flex gap-4'>
//                         <button className='w-fit'>Edit</button>
//                         <button className='font-bold p-4 bg-red-500 w-fit rounded-xl cursor-pointer' onClick={()=> handleDeleted(card.post.metadata.slug)}>Delete</button>
//                         </div>


//                     </div>

        
//                 ))
//             }



//         </section>
      
//     </main>
//   )
// }

// export default page
