from fastapi import FastAPI 
from typing import List
from pydantic import BaseModel
from fastapi.middleware.cors import CORSMiddleware
from collections import deque

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


directions = [(0,1), (1,0), (0,-1), (-1,0)]

def bfs(grid_size, start: Cell, end: Cell):
    queue = deque([(start, [start])])
    visited = set()

    while queue:
        current, path = queue.popleft()

        if current == end:
            return path

        if (current.row, current.col) in visited:
            continue
        visited.add((current.row, current.col))

        for d in directions:
            neighbor = Cell(row=current.row + d[0], col=current.col + d[1])
            if 0 <= neighbor.row < grid_size and 0 <= neighbor.col < grid_size:
                queue.append((neighbor, path + [neighbor]))

    return []

def find_path(grid_size, start: Cell, end: Cell):
    return bfs(grid_size, start, end)

@app.post("/path")
def get_path(data: RequestData):
    path = find_path(20, data.start, data.end)
    return {"path": [cell.dict() for cell in path]}