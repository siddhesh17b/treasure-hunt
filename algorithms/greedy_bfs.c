#include <stdio.h>
#include <stdlib.h>
#include <stdbool.h>
#include <limits.h>
#include <math.h>

#define SIZE 8

// Directions: up, down, left, right
int dx[4] = {0, 0, -1, 1};
int dy[4] = {-1, 1, 0, 0};

// Manhattan distance as heuristic
int manhattan(int x1, int y1, int x2, int y2)
{
    return abs(x1 - x2) + abs(y1 - y2);
}

// Check if a cell is valid (inside grid and not blocked)
bool is_valid(char grid[SIZE][SIZE], int x, int y)
{
    return (x >= 0 && x < SIZE && y >= 0 && y < SIZE && grid[y][x] != '#');
}

// Find the next cell with the smallest heuristic
int find_best(int open[][2], int h[], bool used[], int count)
{
    int min = INT_MAX, idx = -1;
    for (int i = 0; i < count; i++)
    {
        if (!used[i] && h[i] < min)
        {
            min = h[i];
            idx = i;
        }
    }
    return idx;
}

int main()
{
    char grid[SIZE][SIZE] = {
        {'.', '.', '.', '.', '.', '.', '.', '.'},
        {'.', '.', '#', '#', '#', '.', '.', '.'},
        {'.', '.', '#', '.', '.', '.', '.', '.'},
        {'.', '.', '#', '.', '.', '#', '#', '.'},
        {'.', '.', '.', '.', '.', '#', '#', '.'},
        {'#', '#', '#', '.', '.', '.', '.', '.'},
        {'.', '.', '.', '.', '.', '.', '.', '.'},
        {'.', '.', '.', '.', '.', '.', '.', '.'}};

    int startX = 0, startY = 0;
    int goalX = 7, goalY = 7;

    printf("Greedy Best-First Search (Simple Version)\n");
    printf("Start: (%d,%d), Goal: (%d,%d)\n\n", startX, startY, goalX, goalY);

    bool visited[SIZE][SIZE] = {false};
    int parentX[SIZE][SIZE], parentY[SIZE][SIZE];

    // Initialize parents
    for (int i = 0; i < SIZE; i++)
        for (int j = 0; j < SIZE; j++)
            parentX[i][j] = parentY[i][j] = -1;

    // Open list
    int open[SIZE * SIZE][2];
    int h[SIZE * SIZE];
    bool used[SIZE * SIZE] = {false};
    int count = 0;

    // Add start
    open[count][0] = startX;
    open[count][1] = startY;
    h[count] = manhattan(startX, startY, goalX, goalY);
    count++;

    bool found = false;

    while (1)
    {
        int idx = find_best(open, h, used, count);
        if (idx == -1)
            break;

        int x = open[idx][0];
        int y = open[idx][1];
        used[idx] = true;

        if (visited[y][x])
            continue;

        visited[y][x] = true;
        printf("Exploring (%d,%d) -> h=%d\n", x, y, h[idx]);

        if (x == goalX && y == goalY)
        {
            found = true;
            break;
        }

        for (int i = 0; i < 4; i++)
        {
            int nx = x + dx[i];
            int ny = y + dy[i];

            if (is_valid(grid, nx, ny) && !visited[ny][nx])
            {
                open[count][0] = nx;
                open[count][1] = ny;
                h[count] = manhattan(nx, ny, goalX, goalY);
                parentX[ny][nx] = x;
                parentY[ny][nx] = y;
                count++;
            }
        }
    }

    // Reconstruct path
    if (found)
    {
        printf("\nGoal found! Reconstructing path...\n");
        int px = goalX, py = goalY;
        while (px != -1 && py != -1)
        {
            if (!(px == startX && py == startY) && !(px == goalX && py == goalY))
                grid[py][px] = '*';
            int tx = parentX[py][px];
            int ty = parentY[py][px];
            px = tx;
            py = ty;
        }

        // Print final grid
        printf("\nFinal Path (S=start, G=goal, * = path):\n");
        for (int i = 0; i < SIZE; i++)
        {
            for (int j = 0; j < SIZE; j++)
            {
                if (i == startY && j == startX)
                    printf("S ");
                else if (i == goalY && j == goalX)
                    printf("G ");
                else
                    printf("%c ", grid[i][j]);
            }
            printf("\n");
        }
    }
    else
    {
        printf("No path found!\n");
    }

    return 0;
}