import { Router } from 'itty-router';
import notePush from './api/note-push';

const router = Router();

router
	.post('/notes-push', notePush)
	.all('*', () => new Response('404', { status: 404 }));

export default {
	fetch: router.handle,
};
