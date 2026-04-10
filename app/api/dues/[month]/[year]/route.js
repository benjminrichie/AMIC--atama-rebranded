import dbConnect from '@/lib/mongodb';
import MonthlyDues from '@/lib/models/MonthlyDues';
import jwt from 'jsonwebtoken';

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

// GET: Fetch dues for a specific month/year
export async function GET(request, { params }) {
  try {
    await dbConnect();

    const { month, year } = await params;

    if (!month || !year) {
      return new Response(
        JSON.stringify({ success: false, error: 'Month and year are required' }),
        { status: 400 }
      );
    }

    let monthlyDues = await MonthlyDues.findOne({
      month: parseInt(month),
      year: parseInt(year),
    });

    return new Response(
      JSON.stringify({
        success: true,
        data: monthlyDues || {
          month: parseInt(month),
          year: parseInt(year),
          dues: [],
        },
      }),
      { status: 200 }
    );
  } catch (error) {
    return new Response(
      JSON.stringify({ success: false, error: error.message }),
      { status: 500 }
    );
  }
}

// POST: Create or update dues for a month
export async function POST(request, { params }) {
  try {
    const tokenCheck = verifyToken(request);
    if (!tokenCheck.valid) {
      return new Response(
        JSON.stringify({ success: false, error: tokenCheck.error }),
        { status: 401 }
      );
    }

    await dbConnect();

    const { month, year } = await params;
    const { dues } = await request.json();

    if (!month || !year || !dues) {
      return new Response(
        JSON.stringify({ success: false, error: 'Invalid data' }),
        { status: 400 }
      );
    }

    const monthlyDues = await MonthlyDues.findOneAndUpdate(
      {
        month: parseInt(month),
        year: parseInt(year),
      },
      {
        month: parseInt(month),
        year: parseInt(year),
        dues: dues,
      },
      { upsert: true, new: true }
    );

    return new Response(
      JSON.stringify({
        success: true,
        data: monthlyDues,
      }),
      { status: 200 }
    );
  } catch (error) {
    return new Response(
      JSON.stringify({ success: false, error: error.message }),
      { status: 500 }
    );
  }
}

// DELETE: Delete a specific due item
export async function DELETE(request, { params }) {
  try {
    const tokenCheck = verifyToken(request);
    if (!tokenCheck.valid) {
      return new Response(
        JSON.stringify({ success: false, error: tokenCheck.error }),
        { status: 401 }
      );
    }

    await dbConnect();

    const { month, year } = await params;
    const { day, itemIndex } = await request.json();

    const monthlyDues = await MonthlyDues.findOne({
      month: parseInt(month),
      year: parseInt(year),
    });

    if (!monthlyDues) {
      return new Response(
        JSON.stringify({ success: false, error: 'No dues found for this month' }),
        { status: 404 }
      );
    }

    const dayDues = monthlyDues.dues.find((d) => d.day === parseInt(day));
    if (dayDues) {
      dayDues.items.splice(itemIndex, 1);
      if (dayDues.items.length === 0) {
        monthlyDues.dues = monthlyDues.dues.filter((d) => d.day !== parseInt(day));
      }
    }

    await monthlyDues.save();

    return new Response(
      JSON.stringify({
        success: true,
        data: monthlyDues,
      }),
      { status: 200 }
    );
  } catch (error) {
    return new Response(
      JSON.stringify({ success: false, error: error.message }),
      { status: 500 }
    );
  }
}
