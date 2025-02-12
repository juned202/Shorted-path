from fastapi import FastAPI 
from typing import List
from pydantic import BaseModel
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI()

origins = ["*"]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


class Cell(BaseModel):
    row: int 
    col: int

class RequestData(BaseModel):
    start: Cell
    end: Cell


directions = [(0,1),(1,0),(0,-1),(-1,0)]
def dfs(grid_size,start,end,visited,path,best_path):
    if(start.row,start.col) in visited:
        return
    if len(best_path) >0 and len(path) >= len(best_path):
        return
    visited.add((start.row,start.col))
    path.append(start)

    if start ==end:
        if not best_path or len(path) < len(best_path[0]):
            best_path.clear()
            best_path.append(list(path))
        visited.remove((start.row,start.col))
        path.pop()
        return
    for d in directions:
        neighbor = Cell(row=start.row + d[0] , col =start.col+ d[1])
        if 0<=neighbor.row < grid_size and 0<= neighbor.col < grid_size:
            dfs(grid_size,neighbor,end,visited,path,best_path)
    visited.remove((start.row,start.col))
    path.pop()



def find_path(grid_size,start,end):
    best_path = []
    dfs(grid_size,start,end,set(),[],best_path)
    return best_path[0] if best_path else []

@app.post("/path")
def get_path(data: RequestData):
    path = find_path(20,data.start,data.end)
    return {"path":path}