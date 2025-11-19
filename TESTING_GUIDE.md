# 🧪 Claims & Found System - Testing Guide

## ✅ What's Been Implemented

### Phase 1-5 Complete:
- ✅ Backend API endpoints for claims
- ✅ Database models (Items with contact fields, Claims model)
- ✅ Report Item Form with contact fields
- ✅ Item Cards with claim counter
- ✅ ItemDetailModal with claim buttons
- ✅ Profile Page - My Posts with claims management
- ✅ Profile Page - My Claims section

---

## 🔍 Testing the Claim Button Issue

### Step 1: Open Browser Console
1. Open your browser (Chrome/Firefox/Edge)
2. Press `F12` or `Ctrl+Shift+I` to open Developer Tools
3. Go to the "Console" tab

### Step 2: Test the Claim Flow

#### For FOUND Items (User wants to claim):
1. Go to HomePage
2. Click on a FOUND item card
3. ItemDetailModal should open
4. Look for the "Claim this item" button
5. Click the button
6. **Check Console**: Should see "Claim button clicked!"
7. Declaration form should appear
8. Check the checkbox "I have read and agree..."
9. Click "I agree"
10. Description form should appear
11. Fill in the description
12. Click "Send to Finder"
13. **Check Console**: Should see API request logs

#### For LOST Items (User found the item):
1. Go to HomePage
2. Click on a LOST item card
3. ItemDetailModal should open
4. Look for the "Found this item" button
5. Click the button
6. **Check Console**: Should see "Found button clicked!"
7. Declaration form should appear
8. Check the checkbox "I have read and agree..."
9. Click "I agree"
10. Found report form should appear
11. Fill in when/where you found it
12. Click "Send to Owner"
13. **Check Console**: Should see API request logs

---

## 🐛 Common Issues & Solutions

### Issue 1: Button doesn't appear
**Possible Causes:**
- You're the owner of the item (buttons hidden for owners)
- Item status is "claimed" or "reported" (buttons hidden)
- You already claimed this item (shows "Already claimed" message)

**Solution:**
- Test with a different user account
- Create a new item with status "found" or "lost"

### Issue 2: Button appears but nothing happens
**Check:**
1. Open Console (F12)
2. Look for console.log messages
3. Look for error messages in red

**Common Errors:**
- `401 Unauthorized`: User not logged in
  - Solution: Log in first
- `400 Bad Request`: Validation error
  - Solution: Check the error message in console
- `Network Error`: Backend not running
  - Solution: Start backend server

### Issue 3: Declaration doesn't show
**Check:**
- Console should show "Claim button clicked!" or "Found button clicked!"
- If you see the log but no form, check CSS styles
- Try refreshing the page

### Issue 4: Form submission fails
**Check Console for:**
- API endpoint URL (should be `http://localhost:3100/api/claims/addclaim/:id`)
- Request payload
- Response status and message

**Common Issues:**
- Missing required fields
- User not authenticated
- Item already claimed

---

## 🧪 Complete Test Scenarios

### Scenario 1: Lost Item → Someone Found It

**Setup:**
1. User A logs in
2. User A reports a LOST item (e.g., "Water Bottle")
3. User A logs out

**Test:**
1. User B logs in
2. User B goes to HomePage
3. User B clicks on the "Water Bottle" (LOST item)
4. Modal opens with "Found this item" button
5. User B clicks "Found this item"
6. Declaration appears
7. User B checks the checkbox and clicks "I agree"
8. Form appears asking when/where found
9. User B fills: "Found near library on Nov 20th"
10. User B clicks "Send to Owner"
11. Success message appears
12. Modal closes

**Verify:**
1. User A logs in
2. User A goes to Profile → My Posts
3. User A sees "Water Bottle" with "📢 1 Pending Claim"
4. User A clicks "View Claims"
5. User A sees User B's claim with details
6. User A clicks "Approve"
7. Contact info is revealed to both users

### Scenario 2: Found Item → Someone Claims It

**Setup:**
1. User A logs in
2. User A reports a FOUND item (e.g., "Laptop Charger")
3. User A logs out

**Test:**
1. User B logs in
2. User B goes to HomePage
3. User B clicks on the "Laptop Charger" (FOUND item)
4. Modal opens with "Claim this item" button
5. User B clicks "Claim this item"
6. Declaration appears
7. User B checks the checkbox and clicks "I agree"
8. Form appears asking to describe the item
9. User B fills: "Dell charger, 65W, has a small scratch on the side"
10. User B clicks "Send to Finder"
11. Success message appears
12. Modal closes

**Verify:**
1. User A logs in
2. User A goes to Profile → My Posts
3. User A sees "Laptop Charger" with "📢 1 Pending Claim"
4. User A clicks "View Claims"
5. User A sees User B's claim with description
6. User A clicks "Approve"
7. Contact info is revealed to both users

---

## 📊 Backend Testing

### Test API Endpoints Directly

#### 1. Add Claim
```bash
POST http://localhost:3100/api/claims/addclaim/:itemId
Headers: Authorization: Bearer <token>
Body: {
  "message": "I found this item",
  "foundLocation": "Library",
  "foundDate": "Nov 20, 2025",
  "claimType": "found"
}
```

#### 2. Get Claims for Item
```bash
GET http://localhost:3100/api/claims/getclaims/:itemId
Headers: Authorization: Bearer <token>
```

#### 3. Get Claim Count
```bash
GET http://localhost:3100/api/claims/count/:itemId
```

#### 4. Approve Claim
```bash
POST http://localhost:3100/api/claims/approve/:claimId
Headers: Authorization: Bearer <token>
```

#### 5. Reject Claim
```bash
POST http://localhost:3100/api/claims/reject/:claimId
Headers: Authorization: Bearer <token>
```

---

## 🔧 Debugging Steps

### If buttons don't work:

1. **Check if user is logged in:**
```javascript
// In browser console:
console.log(localStorage.getItem("access_token"));
console.log(localStorage.getItem("user_info"));
```

2. **Check item data:**
```javascript
// In ItemDetailModal, add console.log:
console.log("Item:", item);
console.log("Is Owner:", isOwner);
console.log("Item Status:", item.status);
```

3. **Check button visibility conditions:**
```javascript
// In ItemDetailModal:
console.log("Show button:", !isOwner && item.status !== "claimed" && item.status !== "reported");
```

4. **Check API calls:**
- Open Network tab in DevTools
- Filter by "XHR" or "Fetch"
- Click the claim button
- Look for the API request
- Check request headers, payload, and response

---

## ✅ Success Criteria

### The system is working correctly when:

1. ✅ Claim buttons appear for non-owners on active items
2. ✅ Clicking buttons shows declaration forms
3. ✅ Agreeing to declaration shows claim forms
4. ✅ Submitting forms creates claims in database
5. ✅ Claim count updates on item cards
6. ✅ Claims appear in "My Posts" section
7. ✅ Approve/Reject buttons work
8. ✅ Contact info is revealed after approval
9. ✅ Claims appear in "My Claims" section with correct status
10. ✅ Item status changes to "claimed"/"reported" after approval

---

## 📝 Next Steps

If everything is working:
- ✅ Phase 6: Implement email notifications
- ✅ Add real-time in-app notifications
- ✅ Add notification badges
- ✅ Improve error handling and user feedback

If something isn't working:
1. Follow the debugging steps above
2. Check console for errors
3. Verify backend is running
4. Verify database connections
5. Check authentication tokens
