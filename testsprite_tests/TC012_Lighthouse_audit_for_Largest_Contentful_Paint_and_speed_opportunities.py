import asyncio
from playwright import async_api
from playwright.async_api import expect

async def run_test():
    pw = None
    browser = None
    context = None
    
    try:
        # Start a Playwright session in asynchronous mode
        pw = await async_api.async_playwright().start()
        
        # Launch a Chromium browser in headless mode with custom arguments
        browser = await pw.chromium.launch(
            headless=True,
            args=[
                "--window-size=1280,720",         # Set the browser window size
                "--disable-dev-shm-usage",        # Avoid using /dev/shm which can cause issues in containers
                "--ipc=host",                     # Use host-level IPC for better stability
                "--single-process"                # Run the browser in a single process mode
            ],
        )
        
        # Create a new browser context (like an incognito window)
        context = await browser.new_context()
        context.set_default_timeout(5000)
        
        # Open a new page in the browser context
        page = await context.new_page()
        
        # Navigate to your target URL and wait until the network request is committed
        await page.goto("http://localhost:5173", wait_until="commit", timeout=10000)
        
        # Wait for the main page to reach DOMContentLoaded state (optional for stability)
        try:
            await page.wait_for_load_state("domcontentloaded", timeout=3000)
        except async_api.Error:
            pass
        
        # Iterate through all iframes and wait for them to load as well
        for frame in page.frames:
            try:
                await frame.wait_for_load_state("domcontentloaded", timeout=3000)
            except async_api.Error:
                pass
        
        # Interact with the page elements to simulate user flow
        # --> Assertions to verify final state
        frame = context.pages[-1]
        await expect(frame.locator('text=Download PDF AUTO').first).to_be_visible(timeout=30000)
        await expect(frame.locator('text=V1.0.0 STABLE RELEASE').first).to_be_visible(timeout=30000)
        await expect(frame.locator('text=Engineered for Efficiency').first).to_be_visible(timeout=30000)
        await expect(frame.locator('text=Wide Format Support').first).to_be_visible(timeout=30000)
        await expect(frame.locator('text=Mixed Batch Engine').first).to_be_visible(timeout=30000)
        await expect(frame.locator('text=Perfect Merge').first).to_be_visible(timeout=30000)
        await expect(frame.locator('text=Intuitive Controls').first).to_be_visible(timeout=30000)
        await expect(frame.locator('text=Add File').first).to_be_visible(timeout=30000)
        await expect(frame.locator('text=Add to queue').first).to_be_visible(timeout=30000)
        await expect(frame.locator('text=Reorder').first).to_be_visible(timeout=30000)
        await expect(frame.locator('text=Set priority').first).to_be_visible(timeout=30000)
        await expect(frame.locator('text=Sort A-Z').first).to_be_visible(timeout=30000)
        await expect(frame.locator('text=By name').first).to_be_visible(timeout=30000)
        await expect(frame.locator('text=Delete').first).to_be_visible(timeout=30000)
        await expect(frame.locator('text=Remove selected').first).to_be_visible(timeout=30000)
        await expect(frame.locator('text=Clear All').first).to_be_visible(timeout=30000)
        await expect(frame.locator('text=Reset list').first).to_be_visible(timeout=30000)
        await expect(frame.locator('text=Settings').first).to_be_visible(timeout=30000)
        await expect(frame.locator('text=Output path, Merge options').first).to_be_visible(timeout=30000)
        await expect(frame.locator('text=Support').first).to_be_visible(timeout=30000)
        await expect(frame.locator('text=Visit official website').first).to_be_visible(timeout=30000)
        await expect(frame.locator('text=Visual Usage Guide').first).to_be_visible(timeout=30000)
        await expect(frame.locator('text=Step 01').first).to_be_visible(timeout=30000)
        await expect(frame.locator('text=Select & Setup').first).to_be_visible(timeout=30000)
        await expect(frame.locator('text=Step 02').first).to_be_visible(timeout=30000)
        await expect(frame.locator('text=Configure').first).to_be_visible(timeout=30000)
        await expect(frame.locator('text=Step 03').first).to_be_visible(timeout=30000)
        await expect(frame.locator('text=Execute').first).to_be_visible(timeout=30000)
        await expect(frame.locator('text=Step 04').first).to_be_visible(timeout=30000)
        await expect(frame.locator('text=Verify').first).to_be_visible(timeout=30000)
        await expect(frame.locator('text=Ready to streamline your workflow?').first).to_be_visible(timeout=30000)
        await expect(frame.locator('text=Join efficient engineering teams who trust PDF AUTO for their documentation needs.').first).to_be_visible(timeout=30000)
        await expect(frame.locator('text=Download PDF AUTO v1.0.0').first).to_be_visible(timeout=30000)
        await expect(frame.locator('text=Windows 10/11 Compatible').first).to_be_visible(timeout=30000)
        await expect(frame.locator('text=No Installation Required (Portable)').first).to_be_visible(timeout=30000)
        await expect(frame.locator('text=PDF AUTO').first).to_be_visible(timeout=30000)
        await expect(frame.locator('text=© 2024 PDF AUTO. All rights reserved.').first).to_be_visible(timeout=30000)
        await expect(frame.locator('text=Designed for privacy and performance. No data leaves your computer.').first).to_be_visible(timeout=30000)
        await asyncio.sleep(5)
    
    finally:
        if context:
            await context.close()
        if browser:
            await browser.close()
        if pw:
            await pw.stop()
            
asyncio.run(run_test())
    