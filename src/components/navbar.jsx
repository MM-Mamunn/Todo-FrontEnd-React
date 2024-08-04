import React from 'react'

function Nav() {
    const handleNew = () => {

    }
  return (
    <div>
      <div className="main rounded-sm flex justify-between bg-green-950 p-2">
      <div className="px-4 logo text-green-700 font-bold text-[32px] mx-2">
            mtask
          </div>
          <button
            onClick={handleNew}
            className="bg-green-900 disabled:bg-green-950  hover:bg-green-800 text-white rounded-2xl h-[50px] py-1 px-2 mx-4 mt-[9px]"
          >
            Home
          </button>
          
      </div>
    </div>
  )
}

export default Nav
