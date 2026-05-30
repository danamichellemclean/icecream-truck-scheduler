-- Create customers table
CREATE TABLE IF NOT EXISTS customers (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  phone TEXT,
  email TEXT,
  address TEXT,
  notes TEXT,
  createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create events table
CREATE TABLE IF NOT EXISTS events (
  id TEXT PRIMARY KEY,
  date TEXT,
  eventDate TEXT,
  startTime TEXT,
  endTime TEXT,
  end_time TEXT,
  contactName TEXT,
  customerId TEXT,
  package TEXT,
  totalSales REAL,
  employees TEXT,
  notes TEXT,
  createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (customerId) REFERENCES customers(id) ON DELETE SET NULL
);

-- Create settings table
CREATE TABLE IF NOT EXISTS settings (
  id TEXT PRIMARY KEY,
  data JSONB,
  createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Enable Row Level Security (RLS)
ALTER TABLE customers ENABLE ROW LEVEL SECURITY;
ALTER TABLE events ENABLE ROW LEVEL SECURITY;
ALTER TABLE settings ENABLE ROW LEVEL SECURITY;

-- Create policies to allow anonymous users to read/write
CREATE POLICY "Enable read access for anonymous users" ON customers
  FOR SELECT USING (true);

CREATE POLICY "Enable insert for anonymous users" ON customers
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Enable update for anonymous users" ON customers
  FOR UPDATE USING (true);

CREATE POLICY "Enable delete for anonymous users" ON customers
  FOR DELETE USING (true);

CREATE POLICY "Enable read access for anonymous users" ON events
  FOR SELECT USING (true);

CREATE POLICY "Enable insert for anonymous users" ON events
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Enable update for anonymous users" ON events
  FOR UPDATE USING (true);

CREATE POLICY "Enable delete for anonymous users" ON events
  FOR DELETE USING (true);

CREATE POLICY "Enable read access for anonymous users" ON settings
  FOR SELECT USING (true);

CREATE POLICY "Enable insert for anonymous users" ON settings
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Enable update for anonymous users" ON settings
  FOR UPDATE USING (true);

CREATE POLICY "Enable delete for anonymous users" ON settings
  FOR DELETE USING (true);
