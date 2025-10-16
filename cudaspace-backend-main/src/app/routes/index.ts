import express from "express";

import {AuthRoutes} from "../modules/Auth/auth.routes";
import {BlogRoutes} from "../modules/Blog/blog.routes";
import {TestimonialRoutes} from "../modules/Testimonial/testimonial.routes";
import {ContactRoutes} from "../modules/Contact/contact.route";
import {PackageRoutes} from "../modules/Package/Package.route";
import {AdminRoutes} from "../modules/Admin/admin.routes";
import {UserServiceRoutes} from "../modules/User/Services/services.routes";
import {OrderRoutes} from "../modules/Order/order.route";
import {NewsletterRoutes} from "../modules/Newsletter/newsletter.routes";
import {NotificationRoutes} from "../modules/Notification/notification.route";

const router = express.Router();

const moduleRoutes = [
    {
        path: "/auth",
        route: AuthRoutes,
    },
    {
        path: "/blog",
        route: BlogRoutes,
    },
    {
        path: "/testimonial",
        route: TestimonialRoutes,
    },
    {
        path: "/contact",
        route: ContactRoutes,
    },
    {
        path: "/package",
        route: PackageRoutes,
    },
    {
        path: "/admin",
        route: AdminRoutes,
    },
    {
        path: "/user-service",
        route: UserServiceRoutes,
    },
    {
        path: "/order",
        route: OrderRoutes,
    },
    {
        path: "/newsletter",
        route: NewsletterRoutes,
    }, {
        path: "/notification",
        route: NotificationRoutes,
    }
];

moduleRoutes.forEach((route) => router.use(route.path, route.route));

export default router;
