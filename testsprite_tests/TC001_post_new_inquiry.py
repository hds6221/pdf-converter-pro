import requests

BASE_URL = "http://localhost:3001"
INQUIRIES_ENDPOINT = f"{BASE_URL}/inquiries"
TIMEOUT = 30
HEADERS = {"Content-Type": "application/json"}


def test_post_new_inquiry():
    new_inquiry_payload = {
        "title": "TestSprite Backend Test"
    }

    created_inquiry_id = None
    try:
        # Step 1: Verify GET returns list with 200 OK
        get_response = requests.get(INQUIRIES_ENDPOINT, timeout=TIMEOUT)
        assert get_response.status_code == 200, f"GET /inquiries status code expected 200 but got {get_response.status_code}"
        inquiries_list = get_response.json()
        assert isinstance(inquiries_list, list), f"GET /inquiries response should be a list, got {type(inquiries_list)}"

        # Step 2: POST a new inquiry
        post_response = requests.post(INQUIRIES_ENDPOINT, json=new_inquiry_payload, headers=HEADERS, timeout=TIMEOUT)
        assert post_response.status_code == 201, f"POST /inquiries status code expected 201 but got {post_response.status_code}"
        created_inquiry = post_response.json()
        assert "id" in created_inquiry, "Created inquiry response missing 'id'"
        created_inquiry_id = created_inquiry["id"]
        assert created_inquiry.get("title") == new_inquiry_payload["title"], "Created inquiry title mismatch"

        # Step 3: GET inquiry by created ID
        get_id_response = requests.get(f"{INQUIRIES_ENDPOINT}/{created_inquiry_id}", timeout=TIMEOUT)
        assert get_id_response.status_code == 200, f"GET /inquiries/{created_inquiry_id} status code expected 200 but got {get_id_response.status_code}"
        inquiry_by_id = get_id_response.json()
        assert inquiry_by_id.get("id") == created_inquiry_id, "Fetched inquiry ID mismatch"
        assert inquiry_by_id.get("title") == new_inquiry_payload["title"], "Fetched inquiry title mismatch"

        # Step 4: Verify inquiry list updated with new post on top
        get_list_after_post = requests.get(INQUIRIES_ENDPOINT, timeout=TIMEOUT)
        assert get_list_after_post.status_code == 200, f"GET /inquiries after POST status code expected 200 but got {get_list_after_post.status_code}"
        updated_list = get_list_after_post.json()
        assert isinstance(updated_list, list), "Returned inquiries list not a list"
        assert len(updated_list) >= 1, "Inquiries list should have at least one item after POST"
        # New item should be at the top
        top_item = updated_list[0]
        assert top_item.get("id") == created_inquiry_id, "Newest inquiry is not at the top of the list"
        assert top_item.get("title") == new_inquiry_payload["title"], "Top inquiry title mismatch"

    finally:
        # Step 5: DELETE the created inquiry (if created)
        if created_inquiry_id is not None:
            delete_response = requests.delete(f"{INQUIRIES_ENDPOINT}/{created_inquiry_id}", timeout=TIMEOUT)

            assert delete_response.status_code in (200, 204), f"DELETE /inquiries/{created_inquiry_id} status code expected 200 or 204 but got {delete_response.status_code}"

            # Verify deleted item is gone
            get_deleted = requests.get(f"{INQUIRIES_ENDPOINT}/{created_inquiry_id}", timeout=TIMEOUT)
            # json-server returns 404 for not found
            assert get_deleted.status_code == 404, f"Deleted inquiry {created_inquiry_id} still accessible, expected 404 but got {get_deleted.status_code}"


test_post_new_inquiry()