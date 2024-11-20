import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export function WelcomeCard() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Welcome to LogCalc</CardTitle>
      </CardHeader>
      <CardContent className="prose dark:prose-invert">
        <p>
          LogCalc is a specialised calculator designed for winder operators to optimise their production efficiency.
          Created by Jordan Seward, this tool helps you:
        </p>
        <ul>
          <li>Calculate optimal winder speeds based on target production rates</li>
          <li>Track actual production against targets</li>
          <li>Monitor efficiency and maintain production logs</li>
          <li>Generate production forecasts</li>
        </ul>
      </CardContent>
    </Card>
  );
}