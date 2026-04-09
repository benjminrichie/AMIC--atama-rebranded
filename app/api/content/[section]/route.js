import dbConnect from '@/lib/mongodb';
import Health from '@/lib/models/Health';
import Agriculture from '@/lib/models/Agriculture';
import Marketing from '@/lib/models/Marketing';
import jwt from 'jsonwebtoken';

// Map section names to models
const models = {
  health: Health,
  agriculture: Agriculture,
  marketing: Marketing,
};

// Middleware to verify JWT token
function verifyToken(request) {
  const token = request.headers.get('authorization')?.replace('Bearer ', '');

  if (!token) {
    return { valid: false, error: 'No token provided' };
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key');
    return { valid: true, decoded };
  } catch (error) {
    return { valid: false, error: 'Invalid token' };
  }
}

export async function GET(request, { params }) {
  try {
    await dbConnect();

    const { section } = await params;
    const model = models[section];

    if (!model) {
      return new Response(
        JSON.stringify({ success: false, error: 'Invalid section' }),
        { status: 400 }
      );
    }

    const data = await model.findOne({});

    if (!data) {
      return new Response(
        JSON.stringify({ success: true, data: null }),
        { status: 200 }
      );
    }

    return new Response(
      JSON.stringify({ success: true, data }),
      { status: 200 }
    );
  } catch (error) {
    console.error(`Get content error:`, error);
    return new Response(
      JSON.stringify({ success: false, error: error.message }),
      { status: 500 }
    );
  }
}

export async function POST(request, { params }) {
  try {
    // Verify admin token
    const tokenVerification = verifyToken(request);
    if (!tokenVerification.valid) {
      return new Response(
        JSON.stringify({ success: false, error: tokenVerification.error }),
        { status: 401 }
      );
    }

    await dbConnect();

    const { section } = await params;
    const model = models[section];

    if (!model) {
      return new Response(
        JSON.stringify({ success: false, error: 'Invalid section' }),
        { status: 400 }
      );
    }

    const body = await request.json();

    let data = await model.findOne({});

    if (!data) {
      data = await model.create(body);
    } else {
      Object.assign(data, body);
      await data.save();
    }

    return new Response(
      JSON.stringify({ success: true, data }),
      { status: 200 }
    );
  } catch (error) {
    console.error(`Update content error:`, error);
    return new Response(
      JSON.stringify({ success: false, error: error.message }),
      { status: 500 }
    );
  }
}
