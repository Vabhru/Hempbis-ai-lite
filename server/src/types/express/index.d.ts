// server/src/types/express/index.d.ts

// This declaration merges with the existing Express namespace.
// It allows us to add custom properties to the Request object
// without overwriting the entire Express Request type.

// You might want to define a more specific type for 'user' if you have one.
// For example, if you have a User model/interface:
// import { UserAttributes } from '../../models/userModel'; // Adjust path as needed

declare namespace Express {
  export interface Request {
    // Define the user property. It's optional ('?') as not all requests
    // will have a user (e.g., unauthenticated routes).
    user?: {
      id: string | number; // Assuming user has an id
      [key: string]: any;  // Allow other properties on user if not strictly typed
    };
    // Example if you had a UserAttributes type:
    // user?: UserAttributes;
  }
}
