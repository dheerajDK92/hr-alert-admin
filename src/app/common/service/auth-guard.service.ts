import { Injectable } from "@angular/core";
import { Router, CanActivate } from "@angular/router";
import { AuthenticationService } from "./authentication.service";
@Injectable({
  providedIn: "root",
})
export class AuthGuardService implements CanActivate {
  constructor(private authenticationService: AuthenticationService) {}

  canActivate() {
    return this.authenticationService.isAuthenticated();
  }
}
