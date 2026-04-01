-- =============================================
-- NCC Maharashtra - Dummy Data Injection
-- Run this in your Supabase SQL Editor
-- =============================================

-- 1. Insert Admin (ANO) User
INSERT INTO users (id, full_name, email, password, role, phone)
VALUES 
  ('11111111-1111-1111-1111-111111111111', 'Capt. Admin Sir', 'admin@ncc.com', 'password123', 'admin', '9876543210')
ON CONFLICT (email) DO NOTHING;

-- 2. Insert Cadet Users
INSERT INTO users (id, full_name, email, password, role, phone)
VALUES 
  ('22222222-2222-2222-2222-222222222222', 'Ramesh Patil', 'ramesh@ncc.com', 'password123', 'cadet', '9000000001'),
  ('33333333-3333-3333-3333-333333333333', 'Priya Sharma', 'priya@ncc.com', 'password123', 'cadet', '9000000002')
ON CONFLICT (email) DO NOTHING;

-- 3. Insert Cadets Profiles linking to Users
INSERT INTO cadets (id, user_id, cadet_name, father_name, mother_name, dob, blood_group, aadhar_number, cadet_mobile, father_mobile, enrollment_number, sd_sw, year, enrolled_course, college_name, university, residential_address, pincode, nearby_railway_station, bank_name, account_number, ifsc_code, micr_code, status)
VALUES 
  ('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', '22222222-2222-2222-2222-222222222222', 'Ramesh Patil', 'Suresh Patil', 'Geeta Patil', '2004-05-12', 'O+', '123412341234', '9000000001', '9000000011', 'MH20SDA100001', 'SD', '2nd Year', 'B.Tech', 'Modern College', 'Pune University', 'Pune, Maharashtra', '411001', 'Pune Junction', 'SBI', '1111222233334444', 'SBIN0001234', '123456789', 'active'),
  ('bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb', '33333333-3333-3333-3333-333333333333', 'Priya Sharma', 'Rajesh Sharma', 'Neeta Sharma', '2005-08-20', 'B+', '432143214321', '9000000002', '9000000022', 'MH21SWA200002', 'SW', '3rd Year', 'B.Sc', 'National College', 'Mumbai University', 'Mumbai, Maharashtra', '400001', 'Mumbai CST', 'HDFC', '5555666677778888', 'HDFC0004321', '987654321', 'active')
ON CONFLICT (id) DO NOTHING;

-- 4. Insert Upcoming Camps
INSERT INTO camps (id, name, type, location, start_date, end_date, description, max_cadets, status, created_by)
VALUES 
  ('cccccccc-cccc-cccc-cccc-cccccccccccc', 'Annual Training Camp (ATC) 2026', 'Annual Training Camp', 'Khandala Camp Site', '2026-05-01 08:00:00', '2026-05-10 18:00:00', 'Basic 10-day annual camp for all cadets including drill and WT.', 100, 'upcoming', '11111111-1111-1111-1111-111111111111'),
  ('dddddddd-dddd-dddd-dddd-dddddddddddd', 'Republic Day Camp (RDC) Selection', 'Republic Day Camp', 'Pune HQ', '2026-08-15 09:00:00', '2026-08-25 17:00:00', 'Final selection camp for RDC contingent.', 20, 'upcoming', '11111111-1111-1111-1111-111111111111')
ON CONFLICT (id) DO NOTHING;

-- 5. Insert Achievements
INSERT INTO achievements (cadet_id, title, category, description, date_awarded, awarded_by, certificate_url, level, created_by)
VALUES 
  ('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 'Best Shooter 2025', 'Firing', 'Scored 98/100 in Group Level Firing Competition', '2025-10-15', 'Commanding Officer', 'https://images.unsplash.com/photo-1544078751-58fee26d4a86?q=80&w=600&auto=format&fit=crop', 'Group', '22222222-2222-2222-2222-222222222222'),
  ('bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb', 'RDC Participant', 'Drill', 'Selected for Rajpath March Past on Republic Day', '2026-01-26', 'DG NCC', 'https://images.unsplash.com/photo-1579546929518-9e396f3cc809?q=80&w=600&auto=format&fit=crop', 'National', '33333333-3333-3333-3333-333333333333');

-- 6. Insert Study Materials
INSERT INTO study_materials (title, description, category, year, file_url, file_name, file_size, file_type, download_count, uploaded_by)
VALUES 
  ('Drill Manual 2026', 'Official NCC Drill Manual PDF', 'Drill', 'All Years', 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf', 'Drill_Manual.pdf', 2048576, 'application/pdf', 150, '11111111-1111-1111-1111-111111111111'),
  ('Map Reading Basics', 'Compass uses and topological map reading', 'Map Reading', '2nd Year', 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf', 'Map_Reading.pdf', 1548576, 'application/pdf', 45, '11111111-1111-1111-1111-111111111111'),
  ('0.22 Deluxe Rifle WT', 'Weapon Training notes for basic cadets', 'Weapon Training', '1st Year', 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf', 'WT_0.22.pdf', 3048576, 'application/pdf', 210, '11111111-1111-1111-1111-111111111111');

-- 7. Insert Dummy Attendance
INSERT INTO attendance (cadet_id, date, status, gps_verified)
VALUES 
  ('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', CURRENT_DATE, 'present', true),
  ('bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb', CURRENT_DATE, 'present', true);
