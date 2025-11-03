// Backtracking Algorithm for Traveling Salesman Problem
// Finds optimal order to visit all treasures with minimum distance

#include <stdio.h>
#include <stdlib.h>
#include <stdbool.h>
#include <limits.h>
#include <string.h>

// Location on map
typedef struct {
    int x;
    int y;
    char name[20];
} Location;

// Route information
typedef struct {
    int* order;
    int total_distance;
    int num_treasures;
} Route;

// Calculate Manhattan Distance
int calculate_distance(Location a, Location b) {
    return abs(a.x - b.x) + abs(a.y - b.y);
}

// Print route
void print_route(Location start, Location* treasures, Location goal, 
                 int* order, int num_treasures, int distance) {
    printf("%s", start.name);
    for (int i = 0; i < num_treasures; i++) {
        printf(" -> %s", treasures[order[i]].name);
    }
    printf(" -> %s (dist=%d)\n", goal.name, distance);
}

void copy_array(int* dest, int* src, int size) {
    for (int i = 0; i < size; i++) {
        dest[i] = src[i];
    }
}

int permutations_tested = 0;

// Recursive backtracking function
void backtrack(Location start, Location* treasures, Location goal,
               int num_treasures, bool* visited, int* current_order,
               int depth, Location current_location, int current_distance,
               Route* best_route) {
    
    // All treasures visited
    if (depth == num_treasures) {
        int final_distance = current_distance + 
                           calculate_distance(current_location, goal);
        
        permutations_tested++;
        
        printf("#%d: ", permutations_tested);
        print_route(start, treasures, goal, current_order, num_treasures, final_distance);
        
        // Check if this is better
        if (final_distance < best_route->total_distance) {
            printf("  ^ New best!\n");
            best_route->total_distance = final_distance;
            copy_array(best_route->order, current_order, num_treasures);
        }
        
        return;
    }
    
    // Try each unvisited treasure
    for (int i = 0; i < num_treasures; i++) {
        if (visited[i]) {
            continue;
        }
        
        int distance_to_treasure = calculate_distance(current_location, treasures[i]);
        
        // Choose this treasure
        visited[i] = true;
        current_order[depth] = i;
        
        // Recurse
        backtrack(start, treasures, goal, num_treasures, visited, 
                 current_order, depth + 1, treasures[i], 
                 current_distance + distance_to_treasure, best_route);
        
        // Backtrack
        visited[i] = false;
    }
}

// Solve TSP using backtracking
Route solve_tsp_backtracking(Location start, Location* treasures, 
                             int num_treasures, Location goal) {
    
    printf("\nBacktracking TSP Solver\n");
    printf("=======================\n");
    printf("Start: %s (%d,%d)\n", start.name, start.x, start.y);
    printf("Goal: %s (%d,%d)\n", goal.name, goal.x, goal.y);
    printf("Treasures: %d\n", num_treasures);
    for (int i = 0; i < num_treasures; i++) {
        printf("  %s (%d,%d)\n", treasures[i].name, treasures[i].x, treasures[i].y);
    }
    
    // Calculate factorial
    int factorial = 1;
    for (int i = 2; i <= num_treasures; i++) {
        factorial *= i;
    }
    printf("\nTesting %d! = %d permutations\n\n", num_treasures, factorial);
    
    Route best_route;
    best_route.order = (int*)malloc(num_treasures * sizeof(int));
    best_route.total_distance = INT_MAX;
    best_route.num_treasures = num_treasures;
    
    bool* visited = (bool*)calloc(num_treasures, sizeof(bool));
    int* current_order = (int*)malloc(num_treasures * sizeof(int));
    
    permutations_tested = 0;
    
    // Start backtracking
    backtrack(start, treasures, goal, num_treasures, visited, 
             current_order, 0, start, 0, &best_route);
    
    free(visited);
    free(current_order);
    
    printf("\nDone! Tested %d routes\n", permutations_tested);
    printf("Best distance: %d\n\n", best_route.total_distance);
    
    return best_route;
}

int main() {
    printf("Backtracking TSP Demo\n");
    printf("=====================\n");
    
    Location start = {0, 0, "Start"};
    Location goal = {10, 10, "Goal"};
    
    // Test with 4 treasures
    int num_treasures = 4;
    Location treasures[4] = {
        {2, 3, "T1"},
        {7, 2, "T2"},
        {5, 8, "T3"},
        {9, 5, "T4"}
    };
    
    printf("\nMap:\n");
    for (int y = 0; y <= 10; y++) {
        for (int x = 0; x <= 10; x++) {
            if (x == start.x && y == start.y) {
                printf("S ");
            } else if (x == goal.x && y == goal.y) {
                printf("G ");
            } else {
                bool found = false;
                for (int t = 0; t < num_treasures; t++) {
                    if (x == treasures[t].x && y == treasures[t].y) {
                        printf("%d ", t + 1);
                        found = true;
                        break;
                    }
                }
                if (!found) printf(". ");
            }
        }
        printf("\n");
    }
    
    // Solve
    Route optimal = solve_tsp_backtracking(start, treasures, num_treasures, goal);
    
    printf("\n=== OPTIMAL SOLUTION ===\n");
    printf("Best route: ");
    print_route(start, treasures, goal, optimal.order, num_treasures, optimal.total_distance);
    
    printf("\nPath breakdown:\n");
    Location current = start;
    int total = 0;
    
    printf("1. Start at %s (%d,%d)\n", start.name, start.x, start.y);
    
    for (int i = 0; i < num_treasures; i++) {
        Location next = treasures[optimal.order[i]];
        int dist = calculate_distance(current, next);
        total += dist;
        printf("%d. %s (%d,%d) - dist=%d, total=%d\n", 
               i + 2, next.name, next.x, next.y, dist, total);
        current = next;
    }
    
    int final_dist = calculate_distance(current, goal);
    total += final_dist;
    printf("%d. %s (%d,%d) - dist=%d, total=%d\n", 
           num_treasures + 2, goal.name, goal.x, goal.y, final_dist, total);
    
    printf("\nFinal distance: %d\n", optimal.total_distance);
    printf("Routes tested: %d\n", permutations_tested);
    
    free(optimal.order);
    
    return 0;
}
