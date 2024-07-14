import { Webhook } from 'svix'
import { headers } from 'next/headers'
import { WebhookEvent } from '@clerk/nextjs/server'
import { updateUser, createUser, deleteUser } from '@/lib/actions/user.action'
import { Error as MongooseError } from 'mongoose'

export async function POST(req: Request) {

  // You can find this in the Clerk Dashboard -> Webhooks -> choose the endpoint
  const WEBHOOK_SECRET = process.env.WEBHOOK_SECRET

  if (!WEBHOOK_SECRET) {
    throw new Error('Please add WEBHOOK_SECRET from Clerk Dashboard to .env or .env.local')
  }

  // Get the headers
  const headerPayload = headers();
  const svix_id = headerPayload.get("svix-id");
  const svix_timestamp = headerPayload.get("svix-timestamp");
  const svix_signature = headerPayload.get("svix-signature");

  // If there are no headers, error out
  if (!svix_id || !svix_timestamp || !svix_signature) {
    return new Response('Error occured -- no svix headers', {
      status: 400
    })
  }

  // Get the body
  const payload = await req.json()
  const body = JSON.stringify(payload);

  // Create a new Svix instance with your secret.
  const wh = new Webhook(WEBHOOK_SECRET);

  let evt: WebhookEvent

  // Verify the payload with the headers
  try {
    evt = wh.verify(body, {
      "svix-id": svix_id,
      "svix-timestamp": svix_timestamp,
      "svix-signature": svix_signature,
    }) as WebhookEvent
  } catch (err) {
    console.error('Error verifying webhook:', err);
    return new Response('Error occured', {
      status: 400
    })
  }

  // Do something with the payload
  // For this guide, you simply log the payload to the console
  
  const eventType = evt.type;
  
  console.log('Webhook body:', body)


  if(eventType === 'user.created') {
    const {id, email_addresses, image_url, username, first_name, last_name} = evt.data
    
    try {
      //   create new user to database
      const mongoUser = await createUser({
        clerkId: id,
        name: `${first_name}${last_name ? ` ${last_name}` : ""}`,
        email: email_addresses[0].email_address,
        picture: image_url,
        username: username|| `user_${Date.now().toString(36)}`,  //generate a username if not provided
      })
      console.log('User created in MongoDB:', mongoUser);
      return new Response('User created successfully', { status: 200 });

    } catch (error) {
      console.error('Error creating user:', error);
      if (error instanceof MongooseError.ValidationError) {
      const validationErrors = Object.entries(error.errors).map(([key, value]) => ({
        field: key,
        message: value.message
      }));
      console.log(validationErrors)
      }
      return new Response('Error occured', {
        status: 500
        })
      
    }
  
  } 

  if(eventType === 'user.updated') {
    const {id, email_addresses, image_url, username, first_name, last_name} = evt.data
    try {
      const mongoUser = await updateUser({
        clerkId: id,
        updateData: {
            name: `${first_name}${last_name ? ` ${last_name}` : ""}`,
            email: email_addresses[0].email_address,
            picture: image_url,
            username: username!, 
        },
        path: `/profile/${id}`
      })

      console.log(mongoUser)
      return  Response.json({message: 'OK', user: mongoUser})

    } catch(error) {
      console.error('Error updating user in MongoDB', error)
      throw error
    }

    
  
  }

  if(eventType === 'user.deleted') {
    const {id} = evt.data
    const deleteduser = await deleteUser({
        clerkId: id!,
    })
   
    return  Response.json({message: 'OK', user: deleteduser})
  
  }

  return new Response('Webhook processed successfully', { status: 200 });
  }

