"use client";

import { useState } from "react";
import { diagnoseUserAccount } from "@/lib/actions/diagnostics";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function DiagnosticPage() {
  const [results, setResults] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  const runDiagnostics = async () => {
    setLoading(true);
    const data = await diagnoseUserAccount();
    setResults(data);
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-background p-8">
      <div className="max-w-4xl mx-auto">
        <Card>
          <CardHeader>
            <CardTitle>Account Diagnostics</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <Button 
              onClick={runDiagnostics} 
              disabled={loading}
              className="bg-brand-ember hover:bg-brand-ember/90 text-white"
            >
              {loading ? "Running..." : "Run Diagnostics"}
            </Button>

            {results && (
              <div className="space-y-4">
                <div className="p-4 bg-muted rounded-lg">
                  <h3 className="font-bold mb-2">User Info</h3>
                  <p className="text-sm">ID: {results.userId}</p>
                  <p className="text-sm">Email: {results.email}</p>
                </div>

                <div className="p-4 bg-muted rounded-lg">
                  <h3 className="font-bold mb-2">Workouts</h3>
                  <p className="text-sm">Count: {results.workouts?.count}</p>
                  {results.workouts?.error && (
                    <p className="text-sm text-red-500">Error: {results.workouts.error}</p>
                  )}
                </div>

                <div className="p-4 bg-muted rounded-lg">
                  <h3 className="font-bold mb-2">Exercises</h3>
                  <p className="text-sm">Count: {results.exercises?.count}</p>
                  {results.exercises?.error && (
                    <p className="text-sm text-red-500">Error: {results.exercises.error}</p>
                  )}
                </div>

                <div className="p-4 bg-muted rounded-lg">
                  <h3 className="font-bold mb-2">Sets</h3>
                  <p className="text-sm">Count: {results.sets?.count}</p>
                  {results.sets?.error && (
                    <p className="text-sm text-red-500">Error: {results.sets.error}</p>
                  )}
                  {results.sets?.data && (
                    <details className="mt-2">
                      <summary className="text-sm cursor-pointer text-brand-mint">
                        View Sets Data
                      </summary>
                      <pre className="text-xs mt-2 overflow-auto max-h-64 bg-background p-2 rounded">
                        {JSON.stringify(results.sets.data, null, 2)}
                      </pre>
                    </details>
                  )}
                </div>

                <div className="p-4 bg-muted rounded-lg">
                  <h3 className="font-bold mb-2">Update Test</h3>
                  {results.updateTest ? (
                    <>
                      <p className="text-sm">
                        Success: {results.updateTest.success ? "✅ Yes" : "❌ No"}
                      </p>
                      {results.updateTest.error && (
                        <p className="text-sm text-red-500">
                          Error: {results.updateTest.error}
                        </p>
                      )}
                    </>
                  ) : (
                    <p className="text-sm text-muted-foreground">No sets to test</p>
                  )}
                </div>

                <details className="p-4 bg-muted rounded-lg">
                  <summary className="font-bold cursor-pointer">
                    Full Results (JSON)
                  </summary>
                  <pre className="text-xs mt-2 overflow-auto max-h-96 bg-background p-2 rounded">
                    {JSON.stringify(results, null, 2)}
                  </pre>
                </details>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
