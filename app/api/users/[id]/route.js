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

export async function DELETE(request, { params }) {
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

    const { id } = await params;

    if (!id) {
      return new Response(
        JSON.stringify({ success: false, error: 'User ID is required' }),
        { status: 400 }
      );
    }

    const user = await Admin.findByIdAndDelete(id);

    if (!user) {
      return new Response(
        JSON.stringify({ success: false, error: 'User not found' }),
        { status: 404 }
      );
    }

    return new Response(
      JSON.stringify({
        success: true,
        message: 'User deleted successfully',
      }),
      { status: 200 }
    );
  } catch (error) {
    console.error('Error deleting user:', error);
    return new Response(
      JSON.stringify({ success: false, error: error.message || 'Server error' }),
      { status: 500 }
    );
  }
}
