'use server';

// This file is responsible for initializing and registering all AI flows.
// It is imported by the API route to make the flows available.
// It should not export anything.

import './flows/crop-analysis';
import './flows/email';
import './flows/predictions';
