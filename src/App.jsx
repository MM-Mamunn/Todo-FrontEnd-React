import { useEffect, useState } from "react";
import "./App.css";
import { useForm } from "react-hook-form";
import { v4 as uuidv4 } from "uuid";

export default function App() {
  const [todo, setTodo] = useState({
    idd: uuidv4(),
    desc: "",
  });
  const [todos, setTodos] = useState([]);
  const [showFinished, setshowFinished] = useState(false);
  const [showDetails, setShowDetails] = useState("0000");
  const [single, setSingle] = useState({});
  const fetchEverything = async () => {
    let a = await fetch("http://localhost:3000/api/task/view");
    a = await a.json();
    setTodos(a);
    setTodo((prevTodo) => ({
      desc: "",
      idd: uuidv4(),
      isDone: false,
    }));
  };

  const fetchOne= async (idd) => {
    
    setShowDetails(idd);
    let a = await fetch(`http://localhost:3000/api/task/view/${idd}`);
    a = await a.json();
    setSingle(a);
  }
  function delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
 
  useEffect(() => {
    fetchEverything();
  }, []);

  const handleChange = (e) => {
    setTodo((prevTodo) => ({
      ...prevTodo,
      desc: e.target.value,
    }));
  };

  const handleAdd = async (e) => {
    let idd = todo.idd;
    let index = todos.findIndex((item) => {
      return item.idd == idd;
    });

    if (index >= todos.length || index < 0) {
      let a = await fetch("http://localhost:3000/api/task/insert/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(todo),
      });
      a = await a.json();
      setTodo((prevTodo) => ({
        desc: "",
        idd: uuidv4(),
        isDone: false,
      }));
      fetchEverything();
    } else {
      todo.isDone = false;
      let a = await fetch(`http://localhost:3000/api/task/update/${idd}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(todo),
      });
      fetchEverything();
    }
  };



  const handleEdit = (e, idd) => {
     if(showDetails != "0000")
     {
      fetchOne(idd);
     }
    todos.map((item) => {
      if (item.idd == idd) {
        setTodo(item);
      }
    });
  };

  const handleDelete = (e, idd) => {
    setShowDetails("0000")
    todos.map(async (item) => {
      if (item.idd == idd) {
        let a = await fetch(`http://localhost:3000/api/task/delete/${idd}`, {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(todo),
        });
        fetchEverything();
        return;
      }
    });
  };
  const toggleIsDone = async (e, idd) => {
    todos.map(async (item) => {
      if (item.idd == idd) {
        item.isDone = !item.isDone;
        let a = await fetch(`http://localhost:3000/api/task/update/${idd}`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(item),
        });
        fetchEverything();
        return;
      }
    });
  };
  const toggleSide= async (e,idd) => {
    setTodo((prevTodo) => ({
      desc: "",
      idd: uuidv4(),
      isDone: false,
    }));
    fetchOne(idd);
  }
  const toggleFinish = () => {
    setshowFinished(!showFinished);
  };
  return (
    <>
     <div className={showDetails=="0000"?"flx":"flx flex"}>
     <div className={showDetails=="0000"?"container rounded-2xl py-2   bg-green-100 min-h-[70vh] w-[70vw] mt-[40px] ml-[15vw]":"container rounded-2xl py-2   bg-green-100 min-h-[70vh] w-[70vw] mt-[40px] ml-[2vw]"}>
        
        <div className="text flex items-center  ">
          <div className="logo text-green-700 font-bold text-[32px] mx-2">
            mtask
          </div>
          <div className=" msg text-[15px] font-serif mt-[10px] text-green-800">
            Sort your plan
          </div>
        </div>
        <div className="add flex mx-[250px]">
          <input 
            name={todo.desc}
            value={todo.desc}
            onChange={handleChange}
            type="text"
            className="mx-2 px-1 min-h-[70px] min-w-[400px] my-1 bg-white rounded-2xl"
          />
          <button
            onClick={handleAdd}
            disabled={todo.desc.length < 5}
            className="bg-green-900 disabled:bg-green-950 hover:bg-green-800 text-white rounded-2xl h-[60px] py-2 px-3 mt-[9px]"
          >
            Save
          </button>
        </div>
        {todo.desc.length < 5?todo.desc.length >=1?
        <div className="text-[14px] font-bold ml-[18vw] text-red-600 ">{5 - todo.desc.length} more characters needed minimum</div>
          :"":""}
        <div className="line  border-2 mx-[5px] border-green-400 h-[1px]"></div>
        <div className="all mx-[200px]  my-2">
          <div className="flx flex items-center">
            <input
              className="my-4"
              id="show"
              onChange={(e) => toggleFinish()}
              type="checkbox"
              checked={showFinished}
            />
            <div className="px-2  msg2 text-[14px]">Show Finished Task</div>
          </div>
          <div className="line  border-2 mx-[5px] border-green-400 h-[1px] w-[300px] mb-2 opacity-50"></div>
          {!todos.length && (
            <div className="flex text-green-700 font-bold font-serif text-[70px]">
              <div className="text "> No data Yet</div>
              <div className="icon">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="currentColor"
                  className="size-6"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M15.182 16.318A4.486 4.486 0 0 0 12.016 15a4.486 4.486 0 0 0-3.198 1.318M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0ZM9.75 9.75c0 .414-.168.75-.375.75S9 10.164 9 9.75 9.168 9 9.375 9s.375.336.375.75Zm-.375 0h.008v.015h-.008V9.75Zm5.625 0c0 .414-.168.75-.375.75s-.375-.336-.375-.75.168-.75.375-.75.375.336.375.75Zm-.375 0h.008v.015h-.008V9.75Z"
                  />
                </svg>
              </div>
            </div>
          )}
          {todos?.map((item) => {
            return (
              (showFinished || !item.isDone) && (
                <>
                  <div
                    key={item.idd}
                    className="flex justify-between items-center hover:bg-green-300 bg-white px-1 rounded-xl "
                  >
                    <input
                      className="my-4"
                      id="show"
                      onChange={(e) => toggleIsDone(e, item.idd)}
                      type="checkbox"
                      checked={item.isDone}
                    />
                    <button  onClick={(e) => toggleSide(e, item.idd)} className=" tasks  w-[400px] font-bold text-[14px] text-green-800 px-6 ">
                      <div
                        className={
                          item.isDone
                            ? `decoration-red-700     decoration-4 line-through truncate `
                            : `truncate`
                        }
                      >
                        {item.desc}
                      </div>
                      <sub className="ml-[20px] text-[8px] opacity-45 mt-8">
                        {item.updatedAt}
                      </sub>
                    </button>
                    <div className="buttons flex justify-between mx-1">
                      <button
                        onClick={(e) => handleEdit(e, item.idd)}
                        className="edit   rounded-xl h-[44px] px-[5px] text-green-800 font-bold text-[16px] border-black py-1 mx-1"
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                          strokeWidth={1.5}
                          stroke="currentColor"
                          className="size-6"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0 1 15.75 21H5.25A2.25 2.25 0 0 1 3 18.75V8.25A2.25 2.25 0 0 1 5.25 6H10"
                          />
                        </svg>
                      </button>
                      <button
                        onClick={(e) => {
                          handleDelete(e, item.idd);
                        }}
                        className="delete py-1  text-green-800 rounded-xl h-[44px]  font-bold px-[5px] text-[16px] border-black"
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke-width="1.5"
                          stroke="currentColor"
                          class="size-6"
                        >
                          <path
                            stroke-linecap="round"
                            stroke-linejoin="round"
                            d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0"
                          />
                        </svg>
                      </button>
                    </div>
                  </div>
                  <div className="line  border-2 border-green-200 h-[1px]"></div>
                </>
              )
            );
          })}
        </div>
      </div>
      {showDetails!="0000" && <div className="side mt-[100px]  rounded-lg p-1 mx-2">
        <button onClick={(e)=>{setShowDetails("0000")}}className="bg-green-950 hover:bg-green-900 text-white font-bold rounded-xl p-2 text-[15px] mb-1">Cancel</button>
        <div  style={{boxShadow:"3px 3px 4px green"}} className="contain rounded-xl   p-2 text-green-800 text-[15px] font-bold bg-white w-[400px] ">{single.desc}</div>
        <div className="buttons  flex justify-between mx-1">
                      <button
                        onClick={(e) => handleEdit(e, showDetails)}
                        className="edit   m-1 p-[5px] rounded-xl h-[44px] px-[5px] text-green-950 font-bold text-[16px] border-black "
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                          strokeWidth={1.5}
                          stroke="currentColor"
                          className="size-6"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0 1 15.75 21H5.25A2.25 2.25 0 0 1 3 18.75V8.25A2.25 2.25 0 0 1 5.25 6H10"
                          />
                        </svg>
                      </button>
                      <button
                        onClick={(e) => {
                          handleDelete(e, showDetails);
                        }}
                        className="delete  m-1 p-[5px]  text-green-950 rounded-xl h-[44px]  font-bold px-[5px] text-[16px] border-black"
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke-width="1.5"
                          stroke="currentColor"
                          class="size-6"
                        >
                          <path
                            stroke-linecap="round"
                            stroke-linejoin="round"
                            d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0"
                          />
                        </svg>
                      </button>
                    </div>
        </div>}
     </div>
    </>
  );
}