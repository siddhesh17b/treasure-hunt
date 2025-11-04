#include <stdio.h>
#include <stdlib.h>
#include <stdbool.h>
#include <limits.h>
#include <math.h>

// Define grid size (you can change this)
#define ROWS 8
#define COLS 8

/*
    🧠 Concept Recap:
    Greedy Best-First Search chooses the *next cell*
    that looks closest to the goal (based on heuristic),
    even if it’s not necessarily the shortest path overall.

    It uses a simple formula called “Manhattan Distance”
    to decide which move *seems* best.
*/

// Structure to represent a cell
typedef struct
{
    int x, y;
    int h; // heuristic (distance from goal)
} Cell;

// Function to calculate Manhattan distance
int manhattan(int x1, int y1, int x2, int y2)
{
    return abs(x1 - x2) + abs(y1 - y2);
}

// Check if cell is valid (inside grid and not an obstacle)
bool is_valid(int grid[ROWS][COLS], int x, int y)
{
    return (x >= 0 && x < COLS && y >= 0 && y < ROWS && grid[y][x] != 1);
}

// Print the grid with S, G, and obstacles
void print_grid(int grid[ROWS][COLS], int sx, int sy, int gx, int gy)
{
    printf("\nMap (S=Start, G=Goal, #=Wall, .=Free)\n");
    for (int i = 0; i < ROWS; i++)
    {
        for (int j = 0; j < COLS; j++)
        {
            if (i == sy && j == sx)
                printf("S ");
            else if (i == gy && j == gx)
                printf("G ");
            else if (grid[i][j] == 1)
                printf("# ");
            else
                printf(". ");
        }
        printf("\n");
    }
}

/*
    This simple helper function keeps track of explored cells.
    It helps us see which cells were checked by the algorithm.
*/
void print_exploration(int visited[ROWS][COLS])
{
    printf("\nExplored cells so far (x = visited):\n");
    for (int i = 0; i < ROWS; i++)
    {
        for (int j = 0; j < COLS; j++)
        {
            if (visited[i][j])
                printf("x ");
            else
                printf(". ");
        }
        printf("\n");
    }
}

/*
    The main Greedy BFS function
    --------------------------------
    It picks the cell with the lowest heuristic value (closest to goal)
    from all available frontier cells.
*/
void greedy_bfs(int grid[ROWS][COLS], int sx, int sy, int gx, int gy)
{
    // Track visited cells
    int visited[ROWS][COLS] = {0};

    // Store parent to reconstruct path later
    int parentX[ROWS][COLS], parentY[ROWS][COLS];
    for (int i = 0; i < ROWS; i++)
        for (int j = 0; j < COLS; j++)
        {
            parentX[i][j] = -1;
            parentY[i][j] = -1;
        }

    // Open list: stores cells to explore
    Cell open[ROWS * COLS];
    int open_count = 0;

    // Start from the start cell
    open[open_count++] = (Cell){sx, sy, manhattan(sx, sy, gx, gy)};
    visited[sy][sx] = 1;

    printf("\n🚀 Starting Greedy Best-First Search...\n");

    // Directions: Up, Down, Left, Right
    int dx[4] = {0, 0, -1, 1};
    int dy[4] = {-1, 1, 0, 0};

    // Loop until no more cells left to explore
    while (open_count > 0)
    {
        // Find the cell with the smallest heuristic (best guess)
        int best_index = 0;
        for (int i = 1; i < open_count; i++)
            if (open[i].h < open[best_index].h)
                best_index = i;

        // Take that cell out of the open list
        Cell current = open[best_index];
        open[best_index] = open[--open_count];

        printf("\n🔍 Exploring cell (%d,%d), heuristic = %d\n",
               current.x, current.y, current.h);

        // Check if goal reached
        if (current.x == gx && current.y == gy)
        {
            printf("\n🎯 Goal reached at (%d,%d)!\n", gx, gy);
            break;
        }

        // Explore neighbors (Up, Down, Left, Right)
        for (int i = 0; i < 4; i++)
        {
            int nx = current.x + dx[i];
            int ny = current.y + dy[i];

            if (is_valid(grid, nx, ny) && !visited[ny][nx])
            {
                visited[ny][nx] = 1;
                parentX[ny][nx] = current.x;
                parentY[ny][nx] = current.y;
                int h = manhattan(nx, ny, gx, gy);
                open[open_count++] = (Cell){nx, ny, h};
            }
        }

        // Print progress visually
        print_exploration(visited);
    }

    // Reconstruct and show path
    printf("\n🧭 Reconstructing path:\n");
    int path[ROWS * COLS][2];
    int length = 0;

    int x = gx, y = gy;
    while (!(x == sx && y == sy) && parentX[y][x] != -1)
    {
        path[length][0] = x;
        path[length][1] = y;
        int px = parentX[y][x];
        int py = parentY[y][x];
        x = px;
        y = py;
        length++;
    }

    path[length][0] = sx;
    path[length][1] = sy;

    // Show the final path on grid
    printf("\n🌟 Final Path (marked as *):\n");
    for (int i = 0; i < ROWS; i++)
    {
        for (int j = 0; j < COLS; j++)
        {
            bool is_path = false;
            for (int k = 0; k <= length; k++)
            {
                if (path[k][0] == j && path[k][1] == i)
                {
                    is_path = true;
                    break;
                }
            }

            if (i == sy && j == sx)
                printf("S ");
            else if (i == gy && j == gx)
                printf("G ");
            else if (grid[i][j] == 1)
                printf("# ");
            else if (is_path)
                printf("* ");
            else
                printf(". ");
        }
        printf("\n");
    }
}

int main()
{
    printf("=== Greedy Best-First Search Demo ===\n");

    // 0 = free space, 1 = wall
    int grid[ROWS][COLS] = {
        {0, 0, 0, 0, 0, 0, 0, 0},
        {0, 1, 1, 1, 0, 0, 0, 0},
        {0, 1, 0, 0, 0, 0, 0, 0},
        {0, 1, 0, 0, 1, 1, 0, 0},
        {0, 0, 0, 0, 1, 1, 0, 0},
        {1, 1, 1, 0, 0, 0, 0, 0},
        {0, 0, 0, 0, 0, 0, 0, 0},
        {0, 0, 0, 0, 0, 0, 0, 0}};

    int startX = 0, startY = 0;
    int goalX = 7, goalY = 7;

    // Show the grid
    print_grid(grid, startX, startY, goalX, goalY);

    // Run the search
    greedy_bfs(grid, startX, startY, goalX, goalY);

    return 0;
}