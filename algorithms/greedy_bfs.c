// Greedy Best-First Search Algorithm
// Finds shortest path from start to goal on a grid

#include <stdio.h>
#include <stdlib.h>
#include <stdbool.h>
#include <limits.h>

// Position on grid
typedef struct {
    int x;
    int y;
} Position;

// Cell with heuristic value for pathfinding
typedef struct {
    Position pos;
    int heuristic;
    Position parent;
} Cell;

// Priority Queue node
typedef struct PQNode {
    Cell cell;
    struct PQNode* next;
} PQNode;

// Priority Queue
typedef struct {
    PQNode* head;
    int size;
} PriorityQueue;

// Grid structure
typedef struct {
    int width;
    int height;
    char** cells;
    Position start;
    Position goal;
} Grid;

// Calculate Manhattan Distance
int manhattan_distance(Position a, Position b) {
    return abs(a.x - b.x) + abs(a.y - b.y);
}

// Check if position is valid
bool is_valid(Grid* grid, Position pos) {
    if (pos.x < 0 || pos.x >= grid->width || pos.y < 0 || pos.y >= grid->height) {
        return false;
    }
    return grid->cells[pos.y][pos.x] != '#';
}

// Check if positions are equal
bool position_equals(Position a, Position b) {
    return a.x == b.x && a.y == b.y;
}

// Create new priority queue
PriorityQueue* create_priority_queue() {
    PriorityQueue* pq = (PriorityQueue*)malloc(sizeof(PriorityQueue));
    pq->head = NULL;
    pq->size = 0;
    return pq;
}

// Insert into priority queue (sorted by heuristic)
void pq_insert(PriorityQueue* pq, Cell cell) {
    PQNode* new_node = (PQNode*)malloc(sizeof(PQNode));
    new_node->cell = cell;
    new_node->next = NULL;
    
    if (pq->head == NULL || cell.heuristic < pq->head->cell.heuristic) {
        new_node->next = pq->head;
        pq->head = new_node;
    } else {
        PQNode* current = pq->head;
        while (current->next != NULL && current->next->cell.heuristic <= cell.heuristic) {
            current = current->next;
        }
        new_node->next = current->next;
        current->next = new_node;
    }
    pq->size++;
}

// Extract minimum from priority queue
Cell pq_extract_min(PriorityQueue* pq) {
    if (pq->head == NULL) {
        Cell empty = {{-1, -1}, INT_MAX, {-1, -1}};
        return empty;
    }
    
    PQNode* temp = pq->head;
    Cell cell = temp->cell;
    pq->head = pq->head->next;
    free(temp);
    pq->size--;
    
    return cell;
}

bool pq_is_empty(PriorityQueue* pq) {
    return pq->size == 0;
}

void pq_destroy(PriorityQueue* pq) {
    while (pq->head != NULL) {
        PQNode* temp = pq->head;
        pq->head = pq->head->next;
        free(temp);
    }
    free(pq);
}

// Main Greedy BFS implementation
int greedy_bfs(Grid* grid, Position** path_output) {
    printf("\nStarting Greedy Best-First Search\n");
    printf("From (%d,%d) to (%d,%d)\n", grid->start.x, grid->start.y, 
           grid->goal.x, grid->goal.y);
    
    PriorityQueue* open_set = create_priority_queue();
    
    // Track visited cells
    bool** visited = (bool**)calloc(grid->height, sizeof(bool*));
    for (int i = 0; i < grid->height; i++) {
        visited[i] = (bool*)calloc(grid->width, sizeof(bool));
    }
    
    // Store parent for path reconstruction
    Position** parent = (Position**)malloc(grid->height * sizeof(Position*));
    for (int i = 0; i < grid->height; i++) {
        parent[i] = (Position*)malloc(grid->width * sizeof(Position));
        for (int j = 0; j < grid->width; j++) {
            parent[i][j].x = -1;
            parent[i][j].y = -1;
        }
    }
    
    // Start cell
    Cell start_cell;
    start_cell.pos = grid->start;
    start_cell.heuristic = manhattan_distance(grid->start, grid->goal);
    start_cell.parent.x = -1;
    start_cell.parent.y = -1;
    
    pq_insert(open_set, start_cell);
    
    int cells_explored = 0;
    bool found = false;
    
    // Main search loop
    while (!pq_is_empty(open_set)) {
        Cell current = pq_extract_min(open_set);
        
        if (visited[current.pos.y][current.pos.x]) {
            continue;
        }
        
        visited[current.pos.y][current.pos.x] = true;
        cells_explored++;
        
        printf("Exploring (%d,%d) - h=%d\n", 
               current.pos.x, current.pos.y, current.heuristic);
        
        if (position_equals(current.pos, grid->goal)) {
            printf("Goal found! Cells explored: %d\n", cells_explored);
            found = true;
            break;
        }
        
        // Check all 4 neighbors
        Position neighbors[4] = {
            {current.pos.x, current.pos.y - 1},
            {current.pos.x, current.pos.y + 1},
            {current.pos.x - 1, current.pos.y},
            {current.pos.x + 1, current.pos.y}
        };
        
        for (int i = 0; i < 4; i++) {
            Position neighbor = neighbors[i];
            
            if (is_valid(grid, neighbor) && !visited[neighbor.y][neighbor.x]) {
                int h = manhattan_distance(neighbor, grid->goal);
                
                Cell neighbor_cell;
                neighbor_cell.pos = neighbor;
                neighbor_cell.heuristic = h;
                neighbor_cell.parent = current.pos;
                
                parent[neighbor.y][neighbor.x] = current.pos;
                pq_insert(open_set, neighbor_cell);
            }
        }
    }
    
    int path_length = 0;
    
    // Reconstruct path
    if (found) {
        printf("\nReconstructing path...\n");
        
        Position current = grid->goal;
        while (parent[current.y][current.x].x != -1) {
            path_length++;
            current = parent[current.y][current.x];
        }
        path_length++;
        
        *path_output = (Position*)malloc(path_length * sizeof(Position));
        current = grid->goal;
        int index = path_length - 1;
        
        while (parent[current.y][current.x].x != -1) {
            (*path_output)[index--] = current;
            current = parent[current.y][current.x];
        }
        (*path_output)[0] = grid->start;
        
        printf("Path length: %d\n", path_length);
    } else {
        printf("No path found!\n");
    }
    
    // Cleanup
    pq_destroy(open_set);
    for (int i = 0; i < grid->height; i++) {
        free(visited[i]);
        free(parent[i]);
    }
    free(visited);
    free(parent);
    
    return path_length;
}

int main() {
    printf("Greedy Best-First Search Demo\n");
    printf("==============================\n");
    
    Grid grid;
    grid.width = 8;
    grid.height = 8;
    grid.start = (Position){0, 0};
    grid.goal = (Position){7, 7};
    
    grid.cells = (char**)malloc(grid.height * sizeof(char*));
    for (int i = 0; i < grid.height; i++) {
        grid.cells[i] = (char*)malloc(grid.width * sizeof(char));
    }
    
    // Create test grid
    char map[8][9] = {
        "........",
        "..###...",
        "..#.....",
        "..#..##.",
        ".....##.",
        "###.....",
        "........",
        "........"
    };
    
    for (int i = 0; i < grid.height; i++) {
        for (int j = 0; j < grid.width; j++) {
            grid.cells[i][j] = map[i][j];
        }
    }
    
    printf("\nGrid (S=start, G=goal, #=obstacle):\n");
    for (int i = 0; i < grid.height; i++) {
        for (int j = 0; j < grid.width; j++) {
            if (i == grid.start.y && j == grid.start.x) {
                printf("S ");
            } else if (i == grid.goal.y && j == grid.goal.x) {
                printf("G ");
            } else if (grid.cells[i][j] == '#') {
                printf("# ");
            } else {
                printf(". ");
            }
        }
        printf("\n");
    }
    
    Position* path = NULL;
    int path_length = greedy_bfs(&grid, &path);
    
    if (path_length > 0) {
        printf("\nPath found!\n");
        
        // Show path on grid
        printf("\nPath visualization (*=path):\n");
        for (int i = 0; i < grid.height; i++) {
            for (int j = 0; j < grid.width; j++) {
                bool is_path = false;
                for (int p = 0; p < path_length; p++) {
                    if (path[p].x == j && path[p].y == i) {
                        is_path = true;
                        break;
                    }
                }
                
                if (i == grid.start.y && j == grid.start.x) {
                    printf("S ");
                } else if (i == grid.goal.y && j == grid.goal.x) {
                    printf("G ");
                } else if (grid.cells[i][j] == '#') {
                    printf("# ");
                } else if (is_path) {
                    printf("* ");
                } else {
                    printf(". ");
                }
            }
            printf("\n");
        }
        
        free(path);
    }
    
    for (int i = 0; i < grid.height; i++) {
        free(grid.cells[i]);
    }
    free(grid.cells);
    
    return 0;
}
