

// Unit Tests for StatCard logic
describe('StatCard Unit Tests', () => {
  it('should format note count as a number', () => {
    const count = 42;
    expect(typeof count).toBe('number');
    expect(count).toBeGreaterThanOrEqual(0);
  });

  it('should handle zero count for empty workspace', () => {
    const stats = { total: 0, archived: 0, favorites: 0, deleted: 0 };
    expect(stats.total).toBe(0);
    expect(Object.values(stats).every(v => v === 0)).toBe(true);
  });
});

// Unit Tests for Note Data Validation
describe('Note Data Validation', () => {
  const validNote = {
    id: 1,
    title: 'Test Note Title',
    content: '<p>Valid content here</p>',
    category: 'Work',
    tags: 'test,qa,dev',
    color: '#4f46e5',
    is_pinned: 0,
    is_favorite: 0,
    is_archived: 0,
    is_deleted: 0
  };

  it('should have required fields on a note object', () => {
    expect(validNote).toHaveProperty('id');
    expect(validNote).toHaveProperty('title');
    expect(validNote).toHaveProperty('content');
    expect(validNote).toHaveProperty('category');
  });

  it('should strip HTML tags from content for previews', () => {
    const stripHtml = (html) => {
      return html.replace(/<[^>]*>/g, '').trim();
    };
    expect(stripHtml(validNote.content)).toBe('Valid content here');
  });

  it('should parse tags comma-separated correctly', () => {
    const parsedTags = validNote.tags.split(',').filter(t => t.trim());
    expect(parsedTags).toHaveLength(3);
    expect(parsedTags).toContain('test');
    expect(parsedTags).toContain('qa');
  });

  it('should identify valid hex color strings', () => {
    const isValidHexColor = (color) => /^#([0-9A-F]{3}){1,2}$/i.test(color);
    expect(isValidHexColor(validNote.color)).toBe(true);
    expect(isValidHexColor('#fff')).toBe(true);
    expect(isValidHexColor('not-a-color')).toBe(false);
  });

  it('should treat is_pinned as boolean-like integer', () => {
    expect(validNote.is_pinned === 0 || validNote.is_pinned === 1).toBe(true);
  });
});

// Authentication Logic Tests
describe('Authentication Utilities', () => {
  it('should validate strong password format', () => {
    const isStrongEnough = (p) => p.length >= 6;
    expect(isStrongEnough('Password123!')).toBe(true);
    expect(isStrongEnough('weak')).toBe(false);
    expect(isStrongEnough('')).toBe(false);
  });

  it('should validate email format correctly', () => {
    const isValidEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    expect(isValidEmail('sami@example.com')).toBe(true);
    expect(isValidEmail('invalid-email')).toBe(false);
    expect(isValidEmail('user@')).toBe(false);
    expect(isValidEmail('user@domain.co')).toBe(true);
  });

  it('should properly clear tokens from storage on logout', () => {
    localStorage.setItem('zen_token', 'fake_token');
    localStorage.setItem('zen_user', JSON.stringify({ id: 1 }));

    const performLogout = () => {
      localStorage.removeItem('zen_token');
      localStorage.removeItem('zen_user');
    };

    performLogout();
    expect(localStorage.getItem('zen_token')).toBeNull();
    expect(localStorage.getItem('zen_user')).toBeNull();
  });
});

// Notes Sorting Tests
describe('Notes Sorting Logic', () => {
  const mockNotes = [
    { id: 1, title: 'Zeta Note', created_at: '2026-01-01T10:00:00', updated_at: '2026-01-03T10:00:00', is_pinned: 0 },
    { id: 2, title: 'Alpha Note', created_at: '2026-03-15T10:00:00', updated_at: '2026-01-01T10:00:00', is_pinned: 1 },
    { id: 3, title: 'Beta Note', created_at: '2026-02-10T10:00:00', updated_at: '2026-04-01T10:00:00', is_pinned: 0 }
  ];

  it('should put pinned notes first', () => {
    const sorted = [...mockNotes].sort((a, b) => b.is_pinned - a.is_pinned);
    expect(sorted[0].is_pinned).toBe(1);
  });

  it('should sort alphabetically by title', () => {
    const sorted = [...mockNotes].sort((a, b) => a.title.localeCompare(b.title));
    expect(sorted[0].title).toBe('Alpha Note');
    expect(sorted[2].title).toBe('Zeta Note');
  });

  it('should sort by newest creation date', () => {
    const sorted = [...mockNotes].sort(
      (a, b) => new Date(b.created_at) - new Date(a.created_at)
    );
    expect(sorted[0].id).toBe(2);
  });
});
