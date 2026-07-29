import { Router } from "express";
import { authMiddleware } from "../middleware/auth.middleware";
import {
  getTrashItems,
  restoreItem,
  permanentDeleteItem,
  emptyTrash,
} from "../controllers/trash.controller";

const router = Router();

/**
 * GET ALL TRASH ITEMS
 */
router.get("/", authMiddleware, getTrashItems);

/**
 * RESTORE ITEM FROM TRASH
 */
router.post("/:id/restore", authMiddleware, restoreItem);

/**
 * PERMANENTLY DELETE ITEM
 */
router.delete("/:id", authMiddleware, permanentDeleteItem);

/**
 * EMPTY ENTIRE TRASH
 */
router.delete("/", authMiddleware, emptyTrash);

export default router;
