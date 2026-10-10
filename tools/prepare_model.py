import bpy, sys, os, json
from mathutils import Vector

root = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
source = os.path.join(os.path.dirname(root), 'friendly ghost 3d model.glb')
assets = os.path.join(root, 'assets')
os.makedirs(assets, exist_ok=True)
bpy.ops.object.select_all(action='SELECT')
bpy.ops.object.delete(use_global=False)
bpy.ops.import_scene.gltf(filepath=source)
meshes = [o for o in bpy.context.scene.objects if o.type == 'MESH']
points = [o.matrix_world @ Vector(c) for o in meshes for c in o.bound_box]
low = Vector([min(p[i] for p in points) for i in range(3)])
high = Vector([max(p[i] for p in points) for i in range(3)])
factor = 1.0 / (high.z-low.z)
center = Vector(((low.x+high.x)/2, (low.y+high.y)/2, low.z))
# Bake world transforms and normalize to a 1 m tall model standing on Z=0.
for o in meshes:
    world = o.matrix_world.copy()
    o.parent = None
    o.matrix_world.identity()
    for v in o.data.vertices:
        v.co = (world @ v.co - center) * factor
    o.data.update()
    bpy.context.view_layer.objects.active = o
    if len(o.data.polygons) > 60000:
        modifier = o.modifiers.new('Mobile geometry', 'DECIMATE')
        modifier.ratio = 60000 / len(o.data.polygons)
        bpy.ops.object.modifier_apply(modifier=modifier.name)
for image in bpy.data.images:
    if image.size[0] > 0 and max(image.size) > 1024:
        scale = 1024 / max(image.size)
        image.scale(round(image.size[0]*scale), round(image.size[1]*scale))
        image.pack()
bpy.ops.object.select_all(action='DESELECT')
for o in meshes: o.select_set(True)
bpy.ops.export_scene.gltf(filepath=os.path.join(assets, 'ghost.glb'), use_selection=True,
    export_format='GLB', export_image_format='AUTO', export_animations=False)
bpy.ops.wm.usd_export(filepath=os.path.join(assets, 'ghost.usdz'), selected_objects_only=True,
    export_animation=False, export_materials=True, export_textures_mode='NEW',
    generate_preview_surface=True, generate_materialx_network=False,
    usdz_downscale_size='1024', export_custom_properties=False, convert_orientation=True,
    export_global_forward_selection='NEGATIVE_Z', export_global_up_selection='Y',
    meters_per_unit=1.0)
scene = bpy.context.scene
scene.render.engine='CYCLES'
scene.cycles.samples=32
scene.render.resolution_x=800
scene.render.resolution_y=900
scene.render.resolution_percentage=100
scene.render.film_transparent=True
scene.world.color=(0.35,0.35,0.35)
bpy.ops.object.camera_add(location=(0,-2.8,1.0))
camera=bpy.context.object
camera.rotation_euler=(Vector((0,0,0.5))-camera.location).to_track_quat('-Z','Y').to_euler()
camera.data.type='ORTHO'
camera.data.ortho_scale=1.45
scene.camera=camera
for location, energy, size in [((2,-3,4),450,4),((-2,-1,2),250,3),((0,2,3),400,3)]:
    bpy.ops.object.light_add(type='AREA', location=location)
    lamp=bpy.context.object
    lamp.data.energy=energy
    lamp.data.shape='DISK'
    lamp.data.size=size
    lamp.rotation_euler=(Vector((0,0,0.5))-lamp.location).to_track_quat('-Z','Y').to_euler()
scene.render.filepath=os.path.join(assets,'ghost-poster.png')
bpy.ops.render.render(write_still=True)
report={'source_bytes':os.path.getsize(source), 'height_m':1.0,
 'meshes':len(meshes), 'triangles':sum(len(o.data.polygons) for o in meshes),
 'glb_bytes':os.path.getsize(os.path.join(assets,'ghost.glb')),
 'usdz_bytes':os.path.getsize(os.path.join(assets,'ghost.usdz'))}
with open(os.path.join(root,'model-report.json'),'w',encoding='utf-8') as f: json.dump(report,f,indent=2)
print('MODEL_READY',json.dumps(report))
