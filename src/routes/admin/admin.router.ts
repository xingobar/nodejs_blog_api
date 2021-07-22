import AdminAbstractRoutes from "routes/admin/admin.abstract";
import PermissionRoutes from "routes/admin/permission.routes";

const adminRouter: AdminAbstractRoutes[] = [new PermissionRoutes()];

export default adminRouter;
