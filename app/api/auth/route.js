import dbConnect from '@/lib/mongodb';
import Admin from '@/lib/models/Admin';
import jwt from 'jsonwebtoken';

export async function POST(request) {
  try {
    await dbConnect();

    const { action, email, password, name } = await request.json();

    // Login action
    if (action === 'login') {
      if (!email || !password) {
        return new Response(
          JSON.stringify({ success: false, error: 'Email and password are required' }),
          { status: 400 }
        );
      }

      const admin = await Admin.findOne({ email }).select('+password');

      if (!admin) {
        return new Response(
          JSON.stringify({ success: false, error: 'Invalid credentials' }),
          { status: 401 }
        );
      }

      if (!admin.active) {
        return new Response(
          JSON.stringify({ success: false, error: 'Admin account is inactive' }),
          { status: 403 }
        );
      }

      const isPasswordMatch = await admin.matchPassword(password);

      if (!isPasswordMatch) {
        return new Response(
          JSON.stringify({ success: false, error: 'Invalid credentials' }),
          { status: 401 }
        );
      }

      const token = jwt.sign({ id: admin._id, email: admin.email }, process.env.JWT_SECRET || 'your-secret-key', {
        expiresIn: '7d',
      });

      const response = new Response(
        JSON.stringify({
          success: true,
          token,
          admin: {
            id: admin._id,
            email: admin.email,
            name: admin.name,
            role: admin.role,
          },
        }),
        { status: 200 }
      );

      // Set HTTP-only cookie
      response.headers.set(
        'Set-Cookie',
        `adminToken=${token}; Path=/; HttpOnly; SameSite=Strict; Max-Age=604800`
      );

      return response;
    }

    // Register action (only for initial setup - should be admin-only in production)
    if (action === 'register') {
      if (!email || !password || !name) {
        return new Response(
          JSON.stringify({ success: false, error: 'Email, password, and name are required' }),
          { status: 400 }
        );
      }

      let admin = await Admin.findOne({ email });

      if (admin) {
        return new Response(
          JSON.stringify({ success: false, error: 'Admin already exists' }),
          { status: 400 }
        );
      }

      admin = await Admin.create({
        email,
        password,
        name,
        role: 'admin',
      });

      const token = jwt.sign({ id: admin._id, email: admin.email }, process.env.JWT_SECRET || 'your-secret-key', {
        expiresIn: '7d',
      });

      return new Response(
        JSON.stringify({
          success: true,
          token,
          admin: {
            id: admin._id,
            email: admin.email,
            name: admin.name,
            role: admin.role,
          },
        }),
        { status: 201 }
      );
    }

    return new Response(
      JSON.stringify({ success: false, error: 'Invalid action' }),
      { status: 400 }
    );
  } catch (error) {
    console.error('Auth error:', error);
    return new Response(
      JSON.stringify({ success: false, error: error.message }),
      { status: 500 }
    );
  }
}
