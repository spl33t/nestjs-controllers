import { RequestMethod, Controller, Get, Post, Put, Delete } from "@nestjs/common"
import { PATH_METADATA, METHOD_METADATA, CONTROLLER_WATERMARK } from "@nestjs/common/constants"


export const httpMethods = [...Object.keys(RequestMethod), ...Object.keys(RequestMethod).map(s => s.toLowerCase())]
export type HttpMethod = keyof typeof RequestMethod | Lowercase<keyof typeof RequestMethod>

function parseRouteNamePattern(routeParams: string) {
    try {
        const routeName = routeParams.slice(0, routeParams.search("@")) || "not name ;("

        const isRoute = routeParams.search("@")
        if (isRoute === -1) throw new Error("Not route")

        const httpMethod = routeParams.slice(routeParams.search("@") + 1, routeParams.search("\\/")).toUpperCase() as HttpMethod
        if (!httpMethods.includes(httpMethod)) throw new Error("Incorect http method")

        const routePath = routeParams.slice(routeParams.search("\\/") + 1) || "/"

        return {
            routeName,
            httpMethod,
            httpMethodNestKey: RequestMethod[httpMethod.toUpperCase() as any],
            routePath
        }
    } catch {

    }

}

export async function bootstrapControllers(controllers: Record<any, any>) {
    for (const key in controllers) {
        const target = controllers[key]

        Controller(key)(target)
        const routes = Reflect.ownKeys(target["prototype"])
        routes.forEach(route => {
            const descriptor = Reflect.getOwnPropertyDescriptor(target["prototype"], route)
            console.log(descriptor)
            const routeParams = parseRouteNamePattern(route as string)

            if (routeParams) {
                if (routeParams.httpMethod === "GET") {
                    Get(routeParams.routePath)(target, route, descriptor)
                }

                if (routeParams.httpMethod === "POST") {
                    Post(routeParams.routePath)(target, route, descriptor)
                }

                if (routeParams.httpMethod === "PUT") {
                    Put(routeParams.routePath)(target, route, descriptor)
                }

                if (routeParams.httpMethod === "DELETE") {
                    Delete(routeParams.routePath)(target, route, descriptor)
                }
            }
        })

        
    }

   
}

function pathBuild(pathByDecorator: string | string[] | undefined, parsedPath: string) {
    const path: string[] = []
    if (pathByDecorator) {
        if (Array.isArray(pathByDecorator)) {
            const exist = pathByDecorator.find(s => s === parsedPath)
            if (exist)
                path.push(...pathByDecorator)
            else
                path.push(...pathByDecorator, parsedPath)
        } else {
            if (pathByDecorator !== parsedPath)
                path.push(pathByDecorator, parsedPath)
            else
                path.push(parsedPath)
        }
    } else path.push(parsedPath)

    return path
}
