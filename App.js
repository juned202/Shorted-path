import React, { useState} from "react";

const Grid= () => {
  const size= 20;
  const [selected, setSelected] = useState([]);
  const [path, setPath] = useState([]);

  const handleClick = (row,col) => {
    if(selected.length<2){
      setSelected([...selected,{row,col}]);
    }
    if(selected.length == 1){
      fetchPath([...selected,{row,col}]);
    }
  };

  const fetchPath = async (cells) =>{
    const response =await fetch("http://localhost:8080/path", {
      method:"POST",
      headers:{"Content-Type": "application/json"},
      body: JSON.stringify({start:cells[0],end: cells[1]})
     
    });
    const data = await response.json();
    setPath(data.path);
  };

  return(
    <div style = {{display: "grid", gridTemplateColumns: `repeat(${size},20px)`}}> 
      {[...Array(size)].map((_,row)=>
       [...Array(size)].map((_,col)=> {
         const isSelected = selected.some((cell)=> cell.row === row && cell.col === col);
         const isPath = path.some((cell)=> cell.row === row && cell.col === col);
         return (<div 
          key = {`${row}-${col}`}
          onClick = {() => handleClick(row,col)}
          style={{
            width:20,
            height:20,
            border: "1px solid pink",
            backgroundColor: isSelected? "red" : isPath? "blue": "Black",
          }}
          ></div>
        );
  
       })
      )}
    </div>
  );
};

export default Grid;