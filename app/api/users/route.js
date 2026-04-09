import dbConnect from '@/lib/mongodb';
import Admin from '@/lib/models/Admin';
import jwt from 'jsonwebtoken';

// Verify JWT token
function verifyToken(authHeader) {
  if (!authHeader?.startsWith('Bearer ')) {
    return null;
  }

  const token = authHeader.slice(7);
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key');
    return decoded;
  } catch {
    return null;
  }
}

export async function POST(request) {
  try {
    await dbConnect();

    // Verify JWT token
    const authHeader = request.headers.get('authorization');
    const decoded = verifyToken(authHeader);

    if (!decoded) {
      return new Response(
        JSON.stringify({ success: false, error: 'Unauthorized. Invalid or missing token.' }),
        { status: 401 }
      );
    }

    const { name, email, password, role } = await request.json();

    // Validate required fields
    if (!name || !email || !password || !role) {
      return new Response(
        JSON.stringify({ success: false, error: 'Name, email, password, and role are required' }),
        { status: 400 }
      );
    }

    // Check if admin already exists
    let admin = await Admin.findOne({ email });

    if (admin) {
      return new Response(
        JSON.stringify({ success: false, error: 'Admin with this email already exists' }),
        { status: 400 }
      );
    }

    // Create new admin user
    admin = await Admin.create({
      name,
      email,
      password,
      role: role || 'admin',
      active: true,
    });

    return new Response(
      JSON.stringify({
        success: true,
        message: 'User created successfully',
        user: {
          id: admin._id,
          name: admin.name,
          email: admin.email,
          role: admin.role,
        },
      }),
      { status: 201 }
    );
  } catch (error) {
    console.error('Error creating user:', error);
    return new Response(
      JSON.stringify({ success: false, error: error.message || 'Server error' }),
      { status: 500 }
    );
  }
}

export async function GET(request) {
  try {
    await dbConnect();

    // Verify JWT token
    const authHeader = request.headers.get('authorization');
    const decoded = verifyToken(authHeader);

    if (!decoded) {
      return new Response(
        JSON.stringify({ success: false, error: 'Unauthorized. Invalid or missing token.' }),
        { status: 401 }
      );
    }

    // Get all admins
    const admins = await Admin.find({}).select('-password');

    return new Response(
      JSON.stringify({
        success: true,
        users: admins,
      }),
      { status: 200 }
    );
  } catch (error) {
    console.error('Error fetching users:', error);
    return new Response(
      JSON.stringify({ success: false, error: error.message || 'Server error' }),
      { status: 500 }
    );
  }
}
