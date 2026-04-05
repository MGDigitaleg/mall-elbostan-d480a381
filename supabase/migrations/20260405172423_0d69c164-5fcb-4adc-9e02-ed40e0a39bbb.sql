UPDATE stores SET logo_url = REPLACE(logo_url, '.png', '.webp') WHERE logo_url LIKE '%.png';
UPDATE downtown_merchants SET logo_url = REPLACE(logo_url, '/logos/tenants/', '/logos/tenants/') WHERE logo_url LIKE '/logos/tenants/%.png';
UPDATE downtown_merchants SET logo_url = REPLACE(logo_url, '.png', '.webp') WHERE logo_url LIKE '/logos/tenants/%.png';