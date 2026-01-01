import requests
import time

BASE_URL = "http://localhost:3001"
INQUIRIES_ENDPOINT = f"{BASE_URL}/inquiries"
TIMEOUT = 30
HEADERS = {"Content-Type": "application/json"}

def test_admin_reply_to_inquiry():
    inquiry_data = {
        "title": "TestSprite Backend Test",
        "content": "Please reply to this inquiry.",
        "secret": False,
        "reply": None
    }
    reply_text = "This is an admin reply."

    # Create a new inquiry
    response = requests.post(INQUIRIES_ENDPOINT, json=inquiry_data, headers=HEADERS, timeout=TIMEOUT)
    assert response.status_code == 201, f"Expected 201 Created but got {response.status_code}"
    created_inquiry = response.json()
    inquiry_id = created_inquiry.get("id")
    assert inquiry_id is not None, "Created inquiry id is missing"
    assert created_inquiry.get("title") == inquiry_data["title"]
    assert created_inquiry.get("reply") is None

    try:
        # Admin replies to the inquiry - PATCH request to update reply field
        patch_data = {"reply": reply_text}
        reply_url = f"{INQUIRIES_ENDPOINT}/{inquiry_id}"
        patch_resp = requests.patch(reply_url, json=patch_data, headers=HEADERS, timeout=TIMEOUT)
        assert patch_resp.status_code in (200, 201), f"Expected 200 or 201 but got {patch_resp.status_code}"
        patched_inquiry = patch_resp.json()
        assert patched_inquiry.get("reply") == reply_text, "Reply text not saved correctly"

        # Verify the inquiry list shows the reply badge by checking presence of reply field not None
        list_resp = requests.get(INQUIRIES_ENDPOINT, headers=HEADERS, timeout=TIMEOUT)
        assert list_resp.status_code == 200, f"Expected 200 OK but got {list_resp.status_code}"
        inquiries_list = list_resp.json()
        # Find the updated inquiry in the list
        inquiry_in_list = next((inq for inq in inquiries_list if inq.get("id") == inquiry_id), None)
        assert inquiry_in_list is not None, "Updated inquiry not found in list"
        assert inquiry_in_list.get("reply") == reply_text, "Reply badge not updated in inquiry list"

        # Fetch the inquiry details and verify reply is visible
        details_resp = requests.get(reply_url, headers=HEADERS, timeout=TIMEOUT)
        assert details_resp.status_code == 200, f"Expected 200 OK but got {details_resp.status_code}"
        details = details_resp.json()
        assert details.get("reply") == reply_text, "Reply not visible in inquiry details"

    finally:
        # Clean up: Delete the created inquiry
        delete_resp = requests.delete(f"{INQUIRIES_ENDPOINT}/{inquiry_id}", headers=HEADERS, timeout=TIMEOUT)
        assert delete_resp.status_code in (200, 204), f"Expected 200 or 204 but got {delete_resp.status_code}"

        # Verify deletion
        verify_resp = requests.get(f"{INQUIRIES_ENDPOINT}/{inquiry_id}", headers=HEADERS, timeout=TIMEOUT)
        assert verify_resp.status_code == 404, "Deleted inquiry still accessible"

test_admin_reply_to_inquiry()