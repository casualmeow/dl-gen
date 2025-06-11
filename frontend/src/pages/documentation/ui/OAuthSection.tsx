import { Card, Button, AlertDialog, AlertDialogTrigger, AlertDialogContent, AlertDialogTitle, AlertDialogDescription, AlertDialogAction, AlertDialogCancel } from 'entities/components';

export function OAuthSection() {
  return (
    <Card className="mb-8 p-6">
      <h2 className="text-2xl font-bold mb-2">OAuth & Security</h2>
      <p className="text-muted-foreground text-lg mb-2">
        For OAuth setup, see <code>OAUTH_README.md</code> in the root directory. The app supports Google OAuth for secure authentication.
      </p>
      <AlertDialog>
        <AlertDialogTrigger asChild>
          <Button variant="outline">See OAuth Info</Button>
        </AlertDialogTrigger>
        <AlertDialogContent>
          <AlertDialogTitle>OAuth Setup</AlertDialogTitle>
          <AlertDialogDescription>
            1. Register your app in Google Cloud Console.<br />
            2. Set up OAuth credentials and redirect URIs.<br />
            3. Update your backend and frontend configs.<br />
            See <code>OAUTH_README.md</code> for details.
          </AlertDialogDescription>
          <AlertDialogAction>OK</AlertDialogAction>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
        </AlertDialogContent>
      </AlertDialog>
    </Card>
  );
} 