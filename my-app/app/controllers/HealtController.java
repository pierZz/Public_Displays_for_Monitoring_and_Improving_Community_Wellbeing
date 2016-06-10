package controllers;

import models.Users;
import play.data.Form;
import play.libs.Json;
import play.mvc.Controller;
import play.mvc.Result;

import java.util.ArrayList;
import java.util.List;


/**
 * Created by SniPierZz on 15/03/16.
 */
public class HealtController extends Controller {

    public Result index() {
        return ok(views.html.healt.render("Your new application is ready."));
    }

    public Result addUser(){
        Users user = Form.form(Users.class).bindFromRequest().get();

//        user.save();
        return ok(Json.toJson(user));
    }

    public Result getUsers(){

        return ok();
    }

    public Result graphData(){
        Response r = new Response();


        ArrayList<Integer> a1 = new ArrayList<Integer>();
        a1.add(78);
        a1.add(67);
        a1.add(66);
        a1.add(71);
        a1.add(62);
        a1.add(70);
        a1.add(69);
        ArrayList<Integer> a2 = new ArrayList<Integer>();
        a2.add(65);
        a2.add(67);
        a2.add(70);
        a2.add(73);
        a2.add(77);
        a2.add(60);
        a2.add(62);
        ArrayList<Integer> a3 = new ArrayList<Integer>();
        a3.add(62);
        a3.add(65);
        a3.add(67);
        a3.add(66);
        a3.add(70);
        a3.add(69);
        a3.add(72);

        ArrayList<ArrayList<Integer>> array = new ArrayList<>();
        array.add(a1);
        array.add(a2);
        array.add(a3);




        ArrayList<String> axes = new ArrayList<String>();
        axes.add("Last 7");
        axes.add("Last Week");
        axes.add("Last 7 Weeks");


        ArrayList<String> color = new ArrayList<String>();
        color.add("rgba(75,192,192,0.4)");
        color.add("rgba(0,192,192,0.4)");
        color.add("rgba(75,0,192,0.4)");

        r.arrays = array;
        r.axes = axes;
        r.colors = color;
        return ok(Json.toJson(r));
    }

}



