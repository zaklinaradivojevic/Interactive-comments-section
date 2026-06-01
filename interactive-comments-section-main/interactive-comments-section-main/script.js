// ---------- DATA (exactly matching the active-states design) ----------
  const CURRENT_USER = {
    username: "juliusomo",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=juliusomo"
  };

  let store = {
    currentUser: CURRENT_USER,
    comments: [
      {
        id: 1,
        content: "Impressive! Though it seems the drag feature could be improved. But overall it looks incredible. You’ve nailed the design and the responsiveness at various breakpoints works really well.",
        createdAt: "1 month ago",
        score: 12,
        user: { username: "amyrobson", avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=amyrobson" },
        replies: []
      },
      {
        id: 2,
        content: "Woah, your project looks awesome! How long have you been coding for? I’m still new, but think I want to dive into React as well soon. Perhaps you can give me an insight on where I can learn React? Thanks!",
        createdAt: "2 weeks ago",
        score: 5,
        user: { username: "maxblagun", avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=maxblagun" },
        replies: [
          {
            id: 3,
            content: "If you're still new, I'd recommend focusing on the fundamentals of HTML, CSS, and JS before considering React. It’s very tempting to jump ahead but lay a solid foundation first.",
            createdAt: "1 week ago",
            score: 4,
            replyingTo: "maxblagun",
            user: { username: "ramsesmiron", avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=ramsesmiron" }
          },
          {
            id: 4,
            content: "I couldn’t agree more with this. Everything moves so fast and it always seems like everyone knows the newest library/framework. But the fundamentals are what stay constant.",
            createdAt: "2 days ago",
            score: 2,
            replyingTo: "ramsesmiron",
            user: { username: "juliusomo", avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=juliusomo" }
          }
        ]
      }
    ]
  };

  // load from localStorage
  let appData = JSON.parse(localStorage.getItem("comments_active_state")) || store;
  function persist() { localStorage.setItem("comments_active_state", JSON.stringify(appData)); }

  // delete modal state
  let pendingDelete = { id: null, isReply: false, parentId: null };
 // helpers
  function findItem(id, isReply, parentId) {
    if (!isReply) return appData.comments.find(c => c.id === id);
    const parent = appData.comments.find(c => c.id === parentId);
    return parent ? parent.replies.find(r => r.id === id) : null;
  }

  // render everything
  function render() {
    const root = document.getElementById("commentsRoot");
    if (!root) return;
    root.innerHTML = "";

    appData.comments.forEach(comment => {
      const wrapper = document.createElement("div");
      wrapper.style.display = "flex";
      wrapper.style.flexDirection = "column";
      wrapper.style.gap = "20px";
      wrapper.appendChild(createCommentElement(comment, false, null));
      if (comment.replies.length) {
        const replyContainer = document.createElement("div");
        replyContainer.className = "replies-thread";
        comment.replies.forEach(reply => {
          replyContainer.appendChild(createCommentElement(reply, true, comment.id));
        });
        wrapper.appendChild(replyContainer);
      }
      root.appendChild(wrapper);
    });
  }

  function createCommentElement(item, isReply, parentId) {
    const isOwn = item.user.username === appData.currentUser.username;
    const card = document.createElement("div");
    card.className = "comment-card";
    card.setAttribute("data-id", item.id);
    if (isReply) card.setAttribute("data-parent", parentId);

    // score block
    const scoreDiv = document.createElement("div");
    scoreDiv.className = "score-widget";
    scoreDiv.innerHTML = `
      <button class="score-btn upvote" data-id="${item.id}" data-reply="${isReply}" data-parent="${parentId || ''}">
        <svg width="11" height="11" viewBox="0 0 11 11" fill="none"><path d="M6.33333 4.66667H11V6.33333H6.33333V11H4.66667V6.33333H0V4.66667H4.66667V0H6.33333V4.66667Z" fill="currentColor"/></svg>
      </button>
      <span class="score-num">${item.score}</span>
      <button class="score-btn downvote" data-id="${item.id}" data-reply="${isReply}" data-parent="${parentId || ''}">
        <svg width="11" height="3" viewBox="0 0 11 3" fill="none"><path d="M11 0V2.33333H0V0H11Z" fill="currentColor"/></svg>
      </button>
    `;

    // main body
    const mainDiv = document.createElement("div");
    mainDiv.className = "comment-main";
    const replyingSpan = isReply && item.replyingTo ? `<span class="replying-to">@${item.replyingTo}</span>` : "";
    const youBadge = isOwn ? `<span class="you-badge">you</span>` : "";
    mainDiv.innerHTML = `
      <div class="comment-header">
        <img src="${item.user.avatar}" class="avatar" alt="${item.user.username}">
        <span class="username">${item.user.username}</span>
        ${youBadge}
        <span class="timestamp">${item.createdAt}</span>
      </div>
      <div class="comment-content" id="content-${item.id}">
        ${replyingSpan}${escapeHtml(item.content)}
      </div>
    `;

    // actions
    const actionsDiv = document.createElement("div");
    actionsDiv.className = "actions";

    if (isOwn) {
      actionsDiv.innerHTML = `
        <button class="action-btn delete-btn" data-action="delete" data-id="${item.id}" data-reply="${isReply}" data-parent="${parentId || ''}">
          <svg width="12" height="14" viewBox="0 0 12 14" fill="none"><path d="M1.16667 12.4444C1.16667 13.3 1.95556 14 2.94444 14H9.05556C10.0444 14 10.8333 13.3 10.8333 12.4444V3.11111H1.16667V12.4444ZM11.6667 0.777778H8.72222L7.88889 0H4.11111L3.27778 0.777778H0.333333V2.33333H11.6667V0.777778Z" fill="#ED6368"/></svg> Delete
        </button>
        <button class="action-btn edit-btn" data-action="edit" data-id="${item.id}" data-reply="${isReply}" data-parent="${parentId || ''}">
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><path d="M13.4787 2.87156L11.1284 0.52131C10.7844 0.17731 10.229 0.17731 9.88503 0.52131L0.333008 10.0733V13.6666H3.92628L13.4783 4.11463C13.8223 3.77063 13.8223 3.21556 13.4787 2.87156Z" fill="#5357B6"/></svg> Edit
        </button>
      `;
    } else {
      actionsDiv.innerHTML = `
        <button class="action-btn reply-btn" data-action="reply" data-id="${item.id}" data-reply="${isReply}" data-parent="${parentId || ''}">
          <svg width="14" height="13" viewBox="0 0 14 13" fill="none"><path d="M0.226562 4.38379L5.02242 0.22312C5.39912 -0.103233 5.97656 0.1654 5.97656 0.672905V3.32832C9.52981 3.42171 12.1122 4.98188 13.454 8.23438C11.1396 7.57863 8.94821 7.92543 5.97656 9.53489V12.1793C5.97656 12.6882 5.39655 12.9556 5.02102 12.6272L0.226562 8.4418C-0.0755208 8.17799 -0.0755208 7.70135 0.226562 7.43779L4.17904 4.00062L0.226562 4.38379Z" fill="#5357B6"/></svg> Reply
        </button>
      `;
    }

    card.appendChild(scoreDiv);
    card.appendChild(mainDiv);
    card.appendChild(actionsDiv);

    // attach events (delegation inside card)
    card.querySelectorAll(".upvote, .downvote").forEach(btn => {
      btn.addEventListener("click", (e) => {
        const id = parseInt(btn.dataset.id);
        const isReplyFlag = btn.dataset.reply === "true";
        const parent = btn.dataset.parent ? parseInt(btn.dataset.parent) : null;
        const delta = btn.classList.contains("upvote") ? 1 : -1;
        const target = findItem(id, isReplyFlag, parent);
        if (target) {
          target.score = Math.max(0, target.score + delta);
          persist();
          render();
        }
      });
    });

    actionsDiv.querySelectorAll(".action-btn").forEach(btn => {
      btn.addEventListener("click", (e) => {
        const action = btn.dataset.action;
        const id = parseInt(btn.dataset.id);
        const isReplyFlag = btn.dataset.reply === "true";
        const parent = btn.dataset.parent ? parseInt(btn.dataset.parent) : null;
        if (action === "reply") showReplyForm(id, isReplyFlag, parent);
        if (action === "delete") openDeleteModal(id, isReplyFlag, parent);
        if (action === "edit") enableEditMode(id, isReplyFlag, parent);
      });
    });

    return card;
  }

  // ----- REPLY FORM (active state style) -----
  function showReplyForm(targetId, isReply, parentId) {
    // remove any existing floating reply forms
    document.querySelectorAll(".dynamic-reply-card").forEach(el => el.remove());
    const original = findItem(targetId, isReply, parentId);
    if (!original) return;

    const formCard = document.createElement("div");
    formCard.className = "input-card dynamic-reply-card";
    formCard.style.marginTop = "12px";
    formCard.innerHTML = `
      <img src="${appData.currentUser.avatar}" class="avatar" alt="avatar">
      <textarea id="replyTextArea" placeholder="Add a reply...">@${original.user.username}, </textarea>
      <button class="btn-primary replySubmitBtn">REPLY</button>
    `;

    // insert after target comment card
    const targetCard = document.querySelector(`.comment-card[data-id="${targetId}"]`);
    if (targetCard && targetCard.parentNode) {
      targetCard.parentNode.insertBefore(formCard, targetCard.nextSibling);
    } else {
      document.getElementById("commentsRoot").appendChild(formCard);
    }

    const textarea = formCard.querySelector("textarea");
    const submitBtn = formCard.querySelector(".replySubmitBtn");
    textarea.focus();
    textarea.setSelectionRange(textarea.value.length, textarea.value.length);

    submitBtn.onclick = () => {
      let raw = textarea.value.trim();
      if (!raw) return;
      const mention = `@${original.user.username},`;
      let clean = raw.startsWith(mention) ? raw.substring(mention.length).trim() : raw;
      if (!clean) return;

      let actualParent = parentId;
      if (!isReply) actualParent = targetId;
      else actualParent = parentId;

      const parentComment = appData.comments.find(c => c.id === actualParent);
      if (parentComment) {
        const newReply = {
          id: Date.now(),
          content: clean,
          createdAt: "Just now",
          score: 0,
          replyingTo: original.user.username,
          user: { ...appData.currentUser }
        };
        parentComment.replies.push(newReply);
        persist();
        render();
      }
      formCard.remove();
    };
  }

  // ----- EDIT MODE (inline update) -----
  function enableEditMode(id, isReply, parentId) {
    const target = findItem(id, isReply, parentId);
    if (!target) return;
    const card = document.querySelector(`.comment-card[data-id="${id}"]`);
    const contentDiv = card.querySelector(".comment-content");
    if (contentDiv.querySelector(".edit-container")) return;

    const originalText = target.content;
    contentDiv.innerHTML = `
      <div class="edit-container">
        <textarea id="editInput-${id}">${escapeHtml(originalText)}</textarea>
        <button class="btn-primary updateEditBtn">UPDATE</button>
      </div>
    `;
    const textarea = contentDiv.querySelector("textarea");
    const updateBtn = contentDiv.querySelector(".updateEditBtn");
    updateBtn.addEventListener("click", () => {
      const newVal = textarea.value.trim();
      if (!newVal) return;
      target.content = newVal;
      persist();
      render();
    });
  }

  // ----- DELETE MODAL -----
  function openDeleteModal(id, isReply, parentId) {
    pendingDelete = { id, isReply, parentId };
    const modal = document.getElementById("deleteModal");
    modal.classList.add("active");
  }
  function closeDeleteModal() {
    document.getElementById("deleteModal").classList.remove("active");
    pendingDelete = { id: null, isReply: false, parentId: null };
  }
  function performDelete() {
    if (pendingDelete.id === null) return;
    const { id, isReply, parentId } = pendingDelete;
    if (isReply) {
      const parent = appData.comments.find(c => c.id === parentId);
      if (parent) parent.replies = parent.replies.filter(r => r.id !== id);
    } else {
      appData.comments = appData.comments.filter(c => c.id !== id);
    }
    persist();
    closeDeleteModal();
    render();
  }

  // ----- ADD MAIN COMMENT -----
  function addMainComment() {
    const input = document.getElementById("mainCommentInput");
    const text = input.value.trim();
    if (!text) return;
    const newComment = {
      id: Date.now(),
      content: text,
      createdAt: "Just now",
      score: 0,
      user: { ...appData.currentUser },
      replies: []
    };
    appData.comments.push(newComment);
    persist();
    render();
    input.value = "";
  }

  function escapeHtml(str) {
    if (!str) return "";
    return str.replace(/[&<>]/g, function(m) {
      if (m === "&") return "&amp;";
      if (m === "<") return "&lt;";
      if (m === ">") return "&gt;";
      return m;
    });
  }

  // initial setup
  document.addEventListener("DOMContentLoaded", () => {
    render();
    document.getElementById("sendMainBtn").addEventListener("click", addMainComment);
    document.getElementById("cancelModalBtn").addEventListener("click", closeDeleteModal);
    document.getElementById("confirmModalBtn").addEventListener("click", performDelete);
    const modalOverlay = document.getElementById("deleteModal");
    modalOverlay.addEventListener("click", (e) => { if (e.target === modalOverlay) closeDeleteModal(); });
    // set current avatar
    const avatarImg = document.getElementById("currentUserAvatar");
    if (avatarImg) avatarImg.src = appData.currentUser.avatar;
  });

