#include <stdio.h>
#include <stdlib.h>
#include <stdbool.h>
#include <limits.h>
#include <math.h>

#define N 4  // Number of treasures (you can change this!)

/*
    Imagine a robot starting at (0,0),
    it has to collect all treasures (T1...T4)
    and finally go to the goal (10,10).
    The aim is to find the shortest path (least total distance).
*/

// Coordinates of each treasure
int tx[N] = {2, 7, 5, 9};
int ty[N] = {3, 2, 8, 5};

// Start and goal coordinates
int startX = 0, startY = 0;
int goalX = 10, goalY = 10;

// Global variables to store the best result
int best_distance = INT_MAX;   // start with a very large number
int best_order[N];             // store best treasure visiting order
int tested = 0;                // how many total routes we tested

// Function to calculate simple "Manhattan distance" (grid-based)
int distance(int x1, int y1, int x2, int y2)
{
    return abs(x1 - x2) + abs(y1 - y2);
}

/*
    total_distance():
    This function adds up all the distances
    — from Start → each Treasure (in given order) → Goal.
*/
int total_distance(int order[])
{
    int total = 0;
    int x = startX, y = startY;

    // Visit each treasure in the given order
    for (int i = 0; i < N; i++)
    {
        total += distance(x, y, tx[order[i]], ty[order[i]]);
        x = tx[order[i]];
        y = ty[order[i]];
    }

    // Finally, go from last treasure to the Goal
    total += distance(x, y, goalX, goalY);
    return total;
}

/*
    backtrack():
    This is the main recursive function.
    It tries all possible ways (permutations) to visit treasures.

    For example:
    T1 → T2 → T3 → T4
    T2 → T1 → T3 → T4
    ... and so on.

    For each order, it calculates the total distance and remembers the best.
*/
void backtrack(bool visited[], int order[], int depth)
{
    // Base case: if all treasures are visited
    if (depth == N)
    {
        tested++;  // count how many complete routes we tried

        int d = total_distance(order);  // calculate total distance for this order

        // Show what route we are testing
        printf("Route #%d: Start", tested);
        for (int i = 0; i < N; i++)
            printf(" -> T%d", order[i] + 1);
        printf(" -> Goal (Distance = %d)\n", d);

        // If it's the best route so far, save it
        if (d < best_distance)
        {
            best_distance = d;
            for (int i = 0; i < N; i++)
                best_order[i] = order[i];
            printf("  🌟 New best route found!\n");
        }
        return;
    }

    // Try visiting every unvisited treasure next
    for (int i = 0; i < N; i++)
    {
        if (!visited[i])
        {
            // Mark this treasure as visited
            visited[i] = true;
            order[depth] = i;

            // Go deeper into the recursion (try next treasure)
            backtrack(visited, order, depth + 1);

            // Backtrack step — unmark this treasure
            // (so it can be used in other combinations)
            visited[i] = false;
        }
    }
}

int main()
{
    printf("=== Traveling Salesman Problem (Backtracking) ===\n");
    printf("Start: (0,0), Goal: (10,10)\n\n");

    // Print treasure info
    printf("Treasures:\n");
    for (int i = 0; i < N; i++)
        printf("T%d -> (%d,%d)\n", i + 1, tx[i], ty[i]);
    printf("\n");

    // Prepare arrays for recursion
    bool visited[N] = {false};
    int order[N];

    // Start exploring all possible paths
    backtrack(visited, order, 0);

    // After trying all routes
    printf("\n=== ✅ BEST ROUTE FOUND ===\n");
    printf("Start");
    for (int i = 0; i < N; i++)
        printf(" -> T%d", best_order[i] + 1);
    printf(" -> Goal\n");

    printf("Total Distance = %d\n", best_distance);
    printf("Routes Tested = %d\n", tested);

    return 0;
}