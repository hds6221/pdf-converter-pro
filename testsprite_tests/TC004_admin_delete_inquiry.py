import requests

BASE_URL = "http://localhost:3001"
INQUIRIES_ENDPOINT = f"{BASE_URL}/inquiries"
TIMEOUT = 30
HEADERS = {
    "Content-Type": "application/json"
}


def test_admin_delete_inquiry():
    # Step 1: GET inquiries list, verify 200 and list response
    resp_get_all = requests.get(INQUIRIES_ENDPOINT, timeout=TIMEOUT)
    assert resp_get_all.status_code == 200, f"Expected 200 OK, got {resp_get_all.status_code}"
    assert isinstance(resp_get_all.json(), list), "Response should be a list"

    # Step 2: POST a new inquiry with title "TestSprite Backend Test"
    new_inquiry_payload = {
        "title": "TestSprite Backend Test"
    }
    resp_post = requests.post(INQUIRIES_ENDPOINT, json=new_inquiry_payload, headers=HEADERS, timeout=TIMEOUT)
    assert resp_post.status_code == 201, f"Expected 201 Created, got {resp_post.status_code}"
    created_inquiry = resp_post.json()
    assert created_inquiry.get("title") == "TestSprite Backend Test", "Created inquiry title mismatch"
    inquiry_id = created_inquiry.get("id")
    assert inquiry_id is not None, "Created inquiry ID should not be None"

    try:
        # Step 3: GET the created inquiry by ID
        resp_get_one = requests.get(f"{INQUIRIES_ENDPOINT}/{inquiry_id}", timeout=TIMEOUT)
        assert resp_get_one.status_code == 200, f"Expected 200 OK when fetching created inquiry, got {resp_get_one.status_code}"
        inquiry_fetched = resp_get_one.json()
        assert inquiry_fetched.get("id") == inquiry_id, "Fetched inquiry ID does not match created inquiry ID"
        assert inquiry_fetched.get("title") == "TestSprite Backend Test", "Fetched inquiry title mismatch"

        # Step 4: DELETE the created inquiry
        resp_delete = requests.delete(f"{INQUIRIES_ENDPOINT}/{inquiry_id}", timeout=TIMEOUT)
        assert resp_delete.status_code in (200, 204), f"Expected 200 or 204 on delete, got {resp_delete.status_code}"

        # Step 5: Verify the deleted inquiry is gone (404 expected)
        resp_get_after_delete = requests.get(f"{INQUIRIES_ENDPOINT}/{inquiry_id}", timeout=TIMEOUT)
        assert resp_get_after_delete.status_code == 404, f"Expected 404 Not Found after delete, got {resp_get_after_delete.status_code}"

        # Verify inquiry is not in the list anymore
        resp_get_list_after_delete = requests.get(INQUIRIES_ENDPOINT, timeout=TIMEOUT)
        assert resp_get_list_after_delete.status_code == 200, "Failed to get inquiries list after deletion"
        inquiries_after_delete = resp_get_list_after_delete.json()
        assert all(item.get("id") != inquiry_id for item in inquiries_after_delete), "Deleted inquiry still present in list"

    finally:
        # Cleanup: in case deletion failed above, try to delete again to keep test environment clean
        requests.delete(f"{INQUIRIES_ENDPOINT}/{inquiry_id}", timeout=TIMEOUT)


test_admin_delete_inquiry()