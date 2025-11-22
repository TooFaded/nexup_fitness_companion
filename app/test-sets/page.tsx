import { createClient } from "@/lib/supabase/server";

export default async function TestSetsPage() {
  const supabase = await createClient();
  
  const { data: { user } } = await supabase.auth.getUser();
  
  if (!user) {
    return <div>Not logged in</div>;
  }
  
  // Try to get some sets
  const { data: sets, error } = await supabase
    .from('sets')
    .select(`
      id,
      weight,
      reps,
      is_confirmed,
      exercises!inner(
        id,
        exercise_name,
        workouts!inner(
          user_id
        )
      )
    `)
    .eq('exercises.workouts.user_id', user.id)
    .limit(5);
  
  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4">Database Test</h1>
      
      {error && (
        <div className="bg-red-100 p-4 rounded mb-4">
          <p className="font-bold">Error:</p>
          <pre>{JSON.stringify(error, null, 2)}</pre>
        </div>
      )}
      
      {sets && (
        <div>
          <p className="mb-4">Found {sets.length} sets</p>
          <pre className="bg-gray-100 p-4 rounded overflow-auto">
            {JSON.stringify(sets, null, 2)}
          </pre>
        </div>
      )}
    </div>
  );
}
