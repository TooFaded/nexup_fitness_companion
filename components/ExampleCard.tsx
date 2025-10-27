import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export default function ExampleCard() {
  return (
    <Card className="max-w-md mx-auto">
      <CardContent className="p-6 text-center">
        <h1 className="text-3xl font-bold text-brand-charcoal mb-2">Nexup</h1>
        <p className="text-lg text-gray-600 mb-4">Know what&apos;s next.</p>
        <Badge className="mb-6 bg-brand-mint text-white">Brand Badge</Badge>
        <Button className="w-full bg-brand-ember hover:bg-brand-ember/90">
          Get Started
        </Button>
      </CardContent>
    </Card>
  );
}
