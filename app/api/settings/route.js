import dbConnect from '@/lib/mongodb';
import Settings from '@/lib/models/Settings';
import jwt from 'jsonwebtoken';

export async function GET(request) {
  try {
    await dbConnect();
    
    let settings = await Settings.findOne({});
    
    if (!settings) {
      settings = await Settings.create({});
    }
    
    return new Response(
      JSON.stringify({ success: true, settings }),
      { status: 200 }
    );
  } catch (error) {
    console.error('Get settings error:', error);
    return new Response(
      JSON.stringify({ success: false, error: error.message }),
      { status: 500 }
    );
  }
}

export async function POST(request) {
  try {
    // Verify JWT token
    const authHeader = request.headers.get('Authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return new Response(
        JSON.stringify({ success: false, error: 'Unauthorized' }),
        { status: 401 }
      );
    }

    const token = authHeader.substring(7);
    
    try {
      jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key');
    } catch (err) {
      return new Response(
        JSON.stringify({ success: false, error: 'Invalid token' }),
        { status: 401 }
      );
    }

    await dbConnect();
    
    const body = await request.json();
    
    let settings = await Settings.findOne({});
    
    if (!settings) {
      settings = await Settings.create(body);
    } else {
      Object.assign(settings, body);
      await settings.save();
    }
    
    return new Response(
      JSON.stringify({ success: true, settings }),
      { status: 200 }
    );
  } catch (error) {
    console.error('Update settings error:', error);
    return new Response(
      JSON.stringify({ success: false, error: error.message }),
      { status: 500 }
    );
  }
}
